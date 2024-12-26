import Card from './Card';

export default function PlayerHand({ player, onToggleWinner, isOverallWinner }) {
  return (
    <div className={`border p-3 rounded-lg ${
      isOverallWinner ? 'bg-green-100' : 
      player.isWinning ? 'bg-white' : 'bg-white'
    }`}>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-black font-bold whitespace-nowrap">Player {player.id}</h2>
        <button
          onClick={() => onToggleWinner(player.id)}
          className={`px-2 py-1 rounded text-sm ml-2 ${
            player.isWinning 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-200 text-black hover:bg-gray-300'
          }`}
        >
          {player.isWinning ? 'Winning' : 'Mark Winner'}
        </button>
      </div>
      <div className="flex gap-2 justify-center">
        {player.cards.map((card, index) => (
          <Card key={index} card={card} />
        ))}
      </div>
    </div>
  );
} 