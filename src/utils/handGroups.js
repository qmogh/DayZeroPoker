const HAND_GROUPS = {
  1: {
    name: "Top 12 Hands",
    hands: ["AA", "KK", "AKs", "QQ", "AK"]
  },
  2: {
    name: "Premium Hands",
    hands: ["JJ", "TT", "99"]
  },
  3: {
    name: "Strong Hands",
    hands: ["88", "77", "AQs", "AQ"]
  },
  4: {
    name: "Majority Play Hands",
    hands: ["66", "55", "44", "33", "22", "AJs", "ATs", "A9s", "A8s"]
  },
  5: {
    name: "Playable Hands",
    hands: ["A7s", "A6s", "A5s", "A4s", "A3s", "A2s", "KQs", "KQ"]
  },
  6: {
    name: "Suited Connectors",
    hands: ["QJs", "JTs", "T9s", "98s", "87s", "76s", "65s"]
  }
};

function getRandomHand() {
  const allHands = Object.values(HAND_GROUPS).flatMap(group => group.hands);
  return allHands[Math.floor(Math.random() * allHands.length)];
}

function getHandGroup(hand) {
  return Object.entries(HAND_GROUPS).find(([_, group]) => 
    group.hands.includes(hand)
  )?.[0];
}

export { HAND_GROUPS, getRandomHand, getHandGroup }; 