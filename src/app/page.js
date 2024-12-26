'use client'
import { useState } from "react";
import { dealCards } from "@/utils/deck";
import PlayerHand from "@/components/PlayerHand";
import CommunityCards from "@/components/CommunityCards";

export default function Home() {
  const [playerCount, setPlayerCount] = useState(2);
  const [gameStage, setGameStage] = useState('setup');
  const [players, setPlayers] = useState([]);
  const [communityCards, setCommunityCards] = useState([]);
  const [deck, setDeck] = useState([]);

  const startGame = () => {
    const { players: newPlayers, remainingDeck } = dealCards(playerCount);
    setPlayers(newPlayers);
    setDeck(remainingDeck);
    setCommunityCards([]);
    setGameStage('preflop');
  };

  const nextStage = () => {
    const stages = ['preflop', 'flop', 'turn', 'river', 'complete'];
    const currentIndex = stages.indexOf(gameStage);
    
    if (currentIndex === 0) { // Moving to flop
      setCommunityCards([deck[0], deck[1], deck[2]]);
      setDeck(prev => prev.slice(3));
    } else if (currentIndex < stages.length - 1) {
      setCommunityCards(prev => [...prev, deck[0]]);
      setDeck(prev => prev.slice(1));
    }
    
    setGameStage(stages[currentIndex + 1]);
  };

  const toggleWinner = (playerId) => {
    setPlayers(prev => prev.map(player => ({
      ...player,
      isWinning: player.id === playerId ? !player.isWinning : player.isWinning
    })));
  };

  return (
    <div className="min-h-screen p-8 bg-slate-800">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-white">Poker Helper</h1>
        
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
            <button 
              onClick={startGame}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Start Game
            </button>
          </div>
        )}

        {gameStage !== 'setup' && (
          <div className="space-y-8">
            <CommunityCards cards={communityCards} gameStage={gameStage} />
            
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {players.map((player) => (
                <PlayerHand 
                  key={player.id} 
                  player={player}
                  onToggleWinner={toggleWinner}
                />
              ))}
            </div>

            {gameStage !== 'complete' && (
              <button
                onClick={nextStage}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                {gameStage === 'preflop' ? 'Deal Flop' :
                 gameStage === 'flop' ? 'Deal Turn' :
                 gameStage === 'turn' ? 'Deal River' : 'Complete Hand'}
              </button>
            )}

            {gameStage === 'complete' && (
              <button
                onClick={startGame}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                New Hand
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
