import Card from './Card';

export default function PlayerHand({ player, onToggleWinner }) {
  return (
    <div className={`border p-4 rounded-lg bg-white ${player.isWinning ? 'bg-green-100' : ''}`}>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-black font-bold">Player {player.id}</h2>
        <button
          onClick={() => onToggleWinner(player.id)}
          className={`px-2 py-1 rounded text-sm ${
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