import { createDeck } from './deck';
import { evaluateHand } from './pokerEvaluator';

const NUM_SIMULATIONS = 200;

function simulateRemainingCards(deck, numNeeded) {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, numNeeded);
}

function compareHands(hand1, hand2) {
  if (hand1.rank !== hand2.rank) {
    return hand1.rank - hand2.rank;
  }
  if (hand1.value !== hand2.value) {
    return hand1.value - hand2.value;
  }
  // Compare kickers
  for (let i = 0; i < hand1.kickers.length; i++) {
    if (hand1.kickers[i] !== hand2.kickers[i]) {
      return hand1.kickers[i] - hand2.kickers[i];
    }
  }
  return 0;
}

export function calculateWinningOdds(
  playerCards,    // Player's hole cards
  communityCards, // Visible community cards
  numPlayers     // Total number of players
) {
  // Create remaining deck (excluding known cards)
  const remainingDeck = createDeck().filter(card => 
    !playerCards.some(c => c.suit === card.suit && c.value === card.value) &&
    !communityCards.some(c => c.suit === card.suit && c.value === card.value)
  );
  
  let wins = 0;
  let ties = 0;
  
  // For each simulation
  for (let i = 0; i < NUM_SIMULATIONS; i++) {
    // Calculate how many community cards are still needed
    const remainingCommunityCards = 5 - communityCards.length;
    
    // Simulate the remaining community cards
    const simulatedCommunityCards = [
      ...communityCards,
      ...simulateRemainingCards(remainingDeck, remainingCommunityCards)
    ];
    
    // Generate random hands for opponents
    const opponentHands = [];
    for (let j = 0; j < numPlayers - 1; j++) {
      const hand = simulateRemainingCards(
        remainingDeck.filter(card => 
          !opponentHands.flat().includes(card) &&
          !simulatedCommunityCards.includes(card)
        ),
        2
      );
      opponentHands.push(hand);
    }
    
    // Evaluate all hands
    const playerHandRank = evaluateHand(playerCards, simulatedCommunityCards);
    let playerWins = true;
    let isTie = false;
    
    // Compare against each opponent
    for (const opponentHand of opponentHands) {
      const opponentHandRank = evaluateHand(opponentHand, simulatedCommunityCards);
      const comparison = compareHands(playerHandRank, opponentHandRank);
      
      if (comparison < 0) {
        playerWins = false;
        break;
      } else if (comparison === 0) {
        isTie = true;
      }
    }
    
    if (playerWins && !isTie) wins++;
    if (isTie) ties++;
  }
  
  return {
    winningOdds: Number(((wins / NUM_SIMULATIONS) * 100).toFixed(1)),
    tieOdds: Number(((ties / NUM_SIMULATIONS) * 100).toFixed(1)),
    totalEquity: Number((((wins + (ties * 0.5)) / NUM_SIMULATIONS) * 100).toFixed(1))
  };
}