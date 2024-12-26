'use client'
import { useState } from "react";

export default function Home() {
  const [playerCount, setPlayerCount] = useState(2);
  const [gameStage, setGameStage] = useState('setup'); // setup, preflop, flop, turn, river, complete
  const [players, setPlayers] = useState([]);
  const [communityCards, setCommunityCards] = useState([]);

  const startGame = () => {
    // Create new deck and deal cards
    const newPlayers = Array(playerCount).fill(null).map((_, index) => ({
      id: index + 1,
      cards: [], // Will be populated with 2 cards each
      isWinning: false
    }));
    setPlayers(newPlayers);
    setGameStage('preflop');
  };

  return (
    <div className="min-h-screen p-8">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Poker Helper</h1>
        
        {gameStage === 'setup' && (
          <div className="space-y-4">
            <div>
              <label className="block mb-2">Number of Players (2-8):</label>
              <input 
                type="number" 
                min="2" 
                max="8" 
                value={playerCount}
                onChange={(e) => setPlayerCount(Number(e.target.value))}
                className="border p-2 rounded text-black"
              />
            </div>
            {playerCount < 8 ? ( 
            <button 
            onClick={startGame}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Start Game
          </button>
            ) : (
              <p className="text-red-500">Maximum 8 players allowed.</p>
            )}
          </div>
        )}

        {gameStage !== 'setup' && (
          <div className="space-y-8">
            <div className="bg-green-800 p-4 rounded-lg">
              {/* Community cards will go here */}
            </div>
            
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {players.map((player) => (
                <div 
                  key={player.id} 
                  className="border p-4 rounded-lg"
                >
                  <h2 className="font-bold">Player {player.id}</h2>
                  {/* Player cards will go here */}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
