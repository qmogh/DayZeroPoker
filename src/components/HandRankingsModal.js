export default function HandRankingsModal({onClose }) {

  const rankings = [
    { name: 'Royal Flush', description: 'A♠ K♠ Q♠ J♠ 10♠ (same suit)' },
    { name: 'Straight Flush', description: '8♥ 7♥ 6♥ 5♥ 4♥ (same suit)' },
    { name: 'Four of a Kind', description: 'Q♠ Q♣ Q♥ Q♦ A♠' },
    { name: 'Full House', description: 'J♠ J♥ J♣ 8♠ 8♥' },
    { name: 'Flush', description: 'A♣ J♣ 8♣ 6♣ 2♣ (same suit)' },
    { name: 'Straight', description: '9♣ 8♥ 7♠ 6♦ 5♣ (any suits)' },
    { name: 'Three of a Kind', description: '5♠ 5♥ 5♣ K♠ 2♦' },
    { name: 'Two Pair', description: 'K♠ K♥ 9♣ 9♠ A♦' },
    { name: 'One Pair', description: '10♠ 10♣ A♥ J♦ 4♣' },
    { name: 'High Card', description: 'A♠ K♦ Q♥ J♣ 9♠' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-slate-900">Poker Hand Rankings</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="space-y-4">
          {rankings.map((rank, index) => (
            <div 
              key={rank.name}
              className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg"
            >
              <span className="text-2xl font-bold text-slate-700 w-8">
                {10 - index}
              </span>
              <div>
                <h3 className="font-bold text-slate-900">{rank.name}</h3>
                <p className="text-slate-600">{rank.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 