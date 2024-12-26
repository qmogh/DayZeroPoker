import { evaluateHand } from './pokerEvaluator';

function testHandEvaluation() {
  const testCases = [
    {
      name: "Royal Flush Test",
      player: [
        { suit: '♠', value: 'A' },
        { suit: '♠', value: 'K' }
      ],
      community: [
        { suit: '♠', value: 'Q' },
        { suit: '♠', value: 'J' },
        { suit: '♠', value: '10' },
        { suit: '♥', value: '2' },
        { suit: '♣', value: '3' }
      ],
      expected: "Royal Flush"
    },
    {
      name: "Full House Test",
      player: [
        { suit: '♠', value: 'A' },
        { suit: '♥', value: 'A' }
      ],
      community: [
        { suit: '♦', value: 'A' },
        { suit: '♠', value: 'K' },
        { suit: '♥', value: 'K' },
        { suit: '♣', value: '2' },
        { suit: '♦', value: '3' }
      ],
      expected: "Full House"
    },
    {
      name: "Two Pair Test",
      player: [
        { suit: '♠', value: '7' },
        { suit: '♥', value: '2' }
      ],
      community: [
        { suit: '♣', value: '2' },
        { suit: '♥', value: '4' },
        { suit: '♦', value: 'Q' },
        { suit: '♦', value: '3' },
        { suit: '♦', value: '7' }
      ],
      expected: "Two Pair"
    },
    {
      name: "Flush Test",
      player: [
        { suit: '♥', value: 'A' },
        { suit: '♥', value: '3' }
      ],
      community: [
        { suit: '♥', value: '7' },
        { suit: '♥', value: '8' },
        { suit: '♥', value: '2' },
        { suit: '♣', value: 'K' },
        { suit: '♠', value: 'Q' }
      ],
      expected: "Flush"
    },
    {
      name: "Straight Test",
      player: [
        { suit: '♠', value: '6' },
        { suit: '♥', value: '7' }
      ],
      community: [
        { suit: '♦', value: '8' },
        { suit: '♣', value: '9' },
        { suit: '♠', value: '10' },
        { suit: '♥', value: '2' },
        { suit: '♦', value: '3' }
      ],
      expected: "Straight"
    }
  ];

  console.log("=== Starting Poker Hand Evaluation Tests ===\n");

  testCases.forEach(test => {
    console.log(`Testing: ${test.name}`);
    console.log('Player cards:', test.player.map(c => `${c.value}${c.suit}`).join(', '));
    console.log('Community cards:', test.community.map(c => `${c.value}${c.suit}`).join(', '));
    
    const result = evaluateHand(test.player, test.community);
    
    console.log('Expected:', test.expected);
    console.log('Got:', result.name);
    console.log('Matching:', result.name === test.expected ? '✅' : '❌');
    console.log('Full result:', result);
    console.log('\n---\n');
  });
}

// Run the tests
testHandEvaluation();

export { testHandEvaluation }; 