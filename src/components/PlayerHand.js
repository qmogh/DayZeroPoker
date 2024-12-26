import Card from './Card';

export default function PlayerHand({ player, onToggleWinner, isOverallWinner, gameStage }) {
  return (
    <div className={`
      border p-3 rounded-lg relative
      ${isOverallWinner 
        ? 'bg-green-100 border-green-500 border-2 shadow-lg shadow-green-200' 
        : 'bg-white'
      }
    `}>
      {isOverallWinner && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
          {player.evaluation?.name || 'Winner'}
        </div>
      )}
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
          {gameStage !== "complete" ? (player.isWinning ? 'Winning' : 'Mark Winner') : ''}
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