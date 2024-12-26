import { SUITS, VALUES } from './constants';

const HAND_RANKINGS = {
  ROYAL_FLUSH: 10,
  STRAIGHT_FLUSH: 9,
  FOUR_OF_A_KIND: 8,
  FULL_HOUSE: 7,
  FLUSH: 6,
  STRAIGHT: 5,
  THREE_OF_A_KIND: 4,
  TWO_PAIR: 3,
  ONE_PAIR: 2,
  HIGH_CARD: 1
};

const CARD_VALUES = {
  '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
  'J': 11, 'Q': 12, 'K': 13, 'A': 14
};

function evaluateHand(playerCards, communityCards) {
  console.log('=== Hand Evaluation Debug ===');
  console.log('Player cards:', playerCards.map(c => `${c.value}${c.suit}`));
  console.log('Community cards:', communityCards.map(c => `${c.value}${c.suit}`));
  
  const allCards = [...playerCards, ...communityCards];
  
  // Check for duplicate cards
  const cardStrings = allCards.map(c => `${c.value}${c.suit}`);
  const uniqueCards = new Set(cardStrings);
  if (uniqueCards.size !== allCards.length) {
    console.error('Duplicate cards detected!');
    console.log('All cards:', cardStrings);
    console.log('Unique cards:', [...uniqueCards]);
  }
  
  // Validate all cards
  const validCards = allCards.filter(card => 
    card && 
    card.suit && 
    card.value && 
    SUITS.includes(card.suit) && 
    VALUES.includes(card.value)
  );

  // Get all possible 5-card combinations
  const combinations = getCombinations(validCards, 5);
  
  let bestHand = { rank: 0, value: 0, name: '', cards: [] };
  
  for (const combo of combinations) {
    const evaluation = evaluateSingleHand(combo);
    if (evaluation.rank > bestHand.rank || 
       (evaluation.rank === bestHand.rank && evaluation.value > bestHand.value)) {
      bestHand = { ...evaluation, cards: combo };
      console.log('New best hand found:', {
        name: bestHand.name,
        cards: combo.map(c => `${c.value}${c.suit}`)
      });
    }
  }
  
  return bestHand;
}

function evaluateSingleHand(cards) {
  const values = cards.map(card => CARD_VALUES[card.value]);
  const suits = cards.map(card => card.suit);
  
  // Sort values in descending order for kicker comparison
  const sortedValues = [...values].sort((a, b) => b - a);
  
  // Check for flush
  const isFlush = suits.every(suit => suit === suits[0]);
  
  // Check for straight
  const uniqueValues = [...new Set(values)].sort((a, b) => a - b);
  const isStraight = uniqueValues.length === 5 && 
                     uniqueValues[4] - uniqueValues[0] === 4;
  
  // Count value frequencies
  const valueCounts = values.reduce((acc, val) => {
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {});
  
  const frequencies = Object.entries(valueCounts)
    .sort((a, b) => b[1] - a[1] || b[0] - a[0])
    .map(([value, count]) => ({value: Number(value), count}));

  // Determine hand type with kickers
  if (isFlush && isStraight) {
    if (Math.max(...values) === 14) {
      return { rank: HAND_RANKINGS.ROYAL_FLUSH, value: 14, kickers: sortedValues, name: 'Royal Flush', cards };
    }
    return { rank: HAND_RANKINGS.STRAIGHT_FLUSH, value: Math.max(...values), kickers: sortedValues, name: 'Straight Flush', cards };
  }
  
  if (frequencies[0].count === 4) {
    const kickers = sortedValues.filter(v => v !== frequencies[0].value);
    return { 
      rank: HAND_RANKINGS.FOUR_OF_A_KIND, 
      value: frequencies[0].value,
      kickers: [kickers[0]], // Only highest kicker matters for four of a kind
      name: 'Four of a Kind',
      cards 
    };
  }
  
  if (frequencies[0].count === 3 && frequencies[1].count === 2) {
    return { 
      rank: HAND_RANKINGS.FULL_HOUSE, 
      value: frequencies[0].value,
      kickers: [frequencies[1].value], // Second value for full house
      name: 'Full House',
      cards 
    };
  }
  
  if (isFlush) {
    return { 
      rank: HAND_RANKINGS.FLUSH, 
      value: Math.max(...values),
      kickers: sortedValues, // All cards matter for flush
      name: 'Flush',
      cards 
    };
  }
  
  if (isStraight) {
    return { 
      rank: HAND_RANKINGS.STRAIGHT, 
      value: Math.max(...values),
      kickers: sortedValues,
      name: 'Straight',
      cards 
    };
  }
  
  if (frequencies[0].count === 3) {
    const kickers = sortedValues.filter(v => v !== frequencies[0].value).slice(0, 2);
    return { 
      rank: HAND_RANKINGS.THREE_OF_A_KIND, 
      value: frequencies[0].value,
      kickers,
      name: 'Three of a Kind',
      cards 
    };
  }
  
  if (frequencies[0].count === 2 && frequencies[1].count === 2) {
    const kickers = sortedValues.filter(v => v !== frequencies[0].value && v !== frequencies[1].value);
    return { 
      rank: HAND_RANKINGS.TWO_PAIR, 
      value: Math.max(frequencies[0].value, frequencies[1].value),
      kickers: [Math.min(frequencies[0].value, frequencies[1].value), kickers[0]],
      name: 'Two Pair',
      cards 
    };
  }
  
  if (frequencies[0].count === 2) {
    const kickers = sortedValues.filter(v => v !== frequencies[0].value).slice(0, 3);
    return { 
      rank: HAND_RANKINGS.ONE_PAIR, 
      value: frequencies[0].value,
      kickers,
      name: 'One Pair',
      cards 
    };
  }
  
  return { 
    rank: HAND_RANKINGS.HIGH_CARD, 
    value: Math.max(...values),
    kickers: sortedValues.slice(1), // All but the highest card
    name: 'High Card',
    cards 
  };
}

function getCombinations(arr, r) {
  const result = [];
  
  function combine(arr, r, index, current) {
    if (current.length === r) {
      result.push([...current]);
      return;
    }
    
    for (let i = index; i < arr.length; i++) {
      current.push(arr[i]);
      combine(arr, r, i + 1, current);
      current.pop();
    }
  }
  
  combine(arr, r, 0, []);
  return result;
}

function getKeyByValue(object, value) {
  return Number(Object.keys(object).find(key => object[key] === value));
}

export { evaluateHand }; 