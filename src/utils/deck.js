const SUITS = ['♠', '♣', '♥', '♦'];
const VALUES = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

export function createDeck() {
  const deck = [];
  for (const suit of SUITS) {
    for (const value of VALUES) {
      deck.push({ suit, value });
    }
  }
  return shuffle(deck);
}

function shuffle(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export function dealCards(numPlayers) {
  const deck = createDeck();
  const players = [];
  
  // Deal 2 cards to each player
  for (let i = 0; i < numPlayers; i++) {
    const playerCards = [deck.pop(), deck.pop()];
    players.push({
      id: i + 1,
      cards: playerCards,
      isWinning: false
    });
    console.log(`Player ${i + 1} cards:`, playerCards);
  }
  
  return { players, remainingDeck: deck };
}
