'use client'
import { useState } from 'react';
import PlayerHand from '@/components/PlayerHand';
import CommunityCards from '@/components/CommunityCards';
import HandRankingsModal from '@/components/HandRankingsModal';
import { dealCards } from '@/utils/deck';
import { evaluateHand } from '@/utils/pokerEvaluator';
import Footer from '@/components/Footer';

export default function PokerTrainer() {
  const [playerCount, setPlayerCount] = useState(2);
  const [players, setPlayers] = useState([]);
  const [communityCards, setCommunityCards] = useState([]);
  const [gameStage, setGameStage] = useState('setup');
  const [showRankings, setShowRankings] = useState(false);
  const [remainingDeck, setRemainingDeck] = useState([]);

  const startGame = () => {
    const { players: newPlayers, remainingDeck: newDeck } = dealCards(playerCount);
    setPlayers(newPlayers);
    setRemainingDeck(newDeck);
    
    // Deal community cards face down
    const communityCards = [
      newDeck.pop(),
      newDeck.pop(),
      newDeck.pop(),
      newDeck.pop(),
      newDeck.pop(),
    ];
    
    setCommunityCards(communityCards);
    setGameStage('preflop');
  };

  const nextStage = () => {
    const stages = {
      'preflop': 'flop',
      'flop': 'turn',
      'turn': 'river',
      'river': 'complete'
    };

    if (gameStage === 'complete') {
      // Reset game
      setPlayers([]);
      setCommunityCards([]);
      setGameStage('setup');
      return;
    }

    const nextGameStage = stages[gameStage];
    setGameStage(nextGameStage);

    if (nextGameStage === 'complete') {
      // Evaluate final hands
      const finalPlayers = players.map(player => {
        const evaluation = evaluateHand(player.cards, communityCards);
        return { ...player, evaluation };
      });
      setPlayers(finalPlayers);
    }
  };

  const toggleWinner = (playerId) => {
    setPlayers(players.map(player => ({
      ...player,
      isWinning: player.id === playerId ? !player.isWinning : player.isWinning
    })));
  };

  return (
    <div className="min-h-screen p-8 bg-slate-800">
      <main className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Poker Hand Trainer</h1>
          {gameStage != "setup" && (
            <button
              onClick={() => setShowRankings(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Show Hand Rankings
            </button>
          )}
        </div>

        {gameStage === 'setup' && (
          <div className="space-y-6">
            <div className="bg-slate-700 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">How to Use</h2>
              <div className="space-y-4 text-slate-200">
                <p>
                  This poker hand trainer lets you practice identifying winning hands at each stage of Texas Hold'em:
                </p>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>Select the number of players (2-8)</li>
                  <li>After dealing, mark who you think is winning by clicking "Mark Winner"</li>
                  <li>Progress through each stage (Flop, Turn, River)</li>
                  <li>At the end, see if you correctly identified the winning hand at each stage</li>
                </ol>
              </div>
            </div>

            <div className="bg-slate-700 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Game Setup</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Number of Players: {playerCount}
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="8"
                    value={playerCount}
                    onChange={(e) => setPlayerCount(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
                <button
                  onClick={startGame}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Start Game
                </button>
              </div>
            </div>
          </div>
        )}

        {gameStage !== 'setup' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {players.map((player) => (
                <PlayerHand
                  key={player.id}
                  player={player}
                  onToggleWinner={toggleWinner}
                  isOverallWinner={gameStage === 'complete' && player.evaluation?.isWinner}
                  gameStage={gameStage}
                />
              ))}
            </div>

            <CommunityCards cards={communityCards} gameStage={gameStage} />

            <button
              onClick={nextStage}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 block mx-auto"
            >
              {gameStage === 'complete' ? 'New Game' : 'Next Stage'}
            </button>
          </div>
        )}

        {showRankings && (
          <HandRankingsModal onClose={() => setShowRankings(false)} />
        )}
      </main>
      <Footer />
    </div>
  );
}