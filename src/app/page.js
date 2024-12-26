'use client'
import { useState } from "react";
import { dealCards } from "@/utils/deck";
import PlayerHand from "@/components/PlayerHand";
import CommunityCards from "@/components/CommunityCards";
import { evaluateHand } from '@/utils/pokerEvaluator';
import HandRankingsModal from "@/components/HandRankingsModal";

export default function Home() {
  const [playerCount, setPlayerCount] = useState(2);
  const [gameStage, setGameStage] = useState('setup');
  const [players, setPlayers] = useState([]);
  const [communityCards, setCommunityCards] = useState([]);
  const [deck, setDeck] = useState([]);
  const [stageWinners, setStageWinners] = useState({
    preflop: [],
    flop: [],
    turn: [],
    river: []
  });
  const [showRankings, setShowRankings] = useState(false);

  const startGame = () => {
    const { players: newPlayers, remainingDeck } = dealCards(playerCount);
    console.log('=== New Game Started ===');
    console.log('Players:', newPlayers.map(p => ({
      id: p.id,
      cards: p.cards.map(c => `${c.value}${c.suit}`)
    })));
    console.log('Remaining deck size:', remainingDeck.length);
    
    setPlayers(newPlayers);
    setDeck(remainingDeck);
    setCommunityCards([]);
    setGameStage('preflop');
  };

  const nextStage = () => {
    const stages = ['preflop', 'flop', 'turn', 'river', 'complete'];
    const currentIndex = stages.indexOf(gameStage);
    
    if (gameStage !== 'complete') {
      setStageWinners(prev => ({
        ...prev,
        [gameStage]: players.filter(p => p.isWinning).map(p => p.id)
      }));
    }
    
    if (currentIndex === 0) {
      const flop = [deck[0], deck[1], deck[2]];
      console.log('Dealing flop:', flop.map(c => `${c.value}${c.suit}`));
      setCommunityCards(flop);
      setDeck(prev => prev.slice(3));
    } else if (currentIndex < stages.length - 2) { // This stupid line....i was so confused why my hand evaluations were off.
      const newCard = deck[0];
      console.log(`Dealing ${stages[currentIndex + 1]}:`, `${newCard.value}${newCard.suit}`);
      setCommunityCards(prev => [...prev, newCard]);
      setDeck(prev => prev.slice(1));
    }
    
    if (stages[currentIndex + 1] === 'complete') {
      const playerHands = players.map(player => ({
        ...player,
        evaluation: evaluateHand(player.cards, [...communityCards, deck[0]])
      }));
      
      const bestHand = Math.max(...playerHands.map(p => p.evaluation.rank));
      const winners = playerHands.filter(p => p.evaluation.rank === bestHand);
      
      setPlayers(playerHands);
    }
    
    setGameStage(stages[currentIndex + 1]);
  };

  const toggleWinner = (playerId) => {
    setPlayers(prev => prev.map(player => ({
      ...player,
      isWinning: player.id === playerId ? !player.isWinning : player.isWinning
    })));
  };

  const GameSummary = () => {
    // Helper function to evaluate hands at a specific stage
    const evaluateStage = (stage) => {
      let stageCards = [];
      switch(stage) {
        case 'preflop':
          return players.map(player => ({
            id: player.id,
            evaluation: evaluateHand(player.cards, [])
          }));
        case 'flop':
          stageCards = communityCards.slice(0, 3);
          break;
        case 'turn':
          stageCards = communityCards.slice(0, 4);
          break;
        case 'river':
          stageCards = communityCards;
          break;
      }
      
      // Add debugging
      console.log(`${stage} evaluation:`);
      console.log('Community cards:', stageCards);
      
      return players.map(player => {
        // Add debugging for each player's evaluation
        console.log(`Player ${player.id} cards:`, player.cards);
        const evaluation = evaluateHand(player.cards, stageCards);
        console.log(`Player ${player.id} evaluation:`, evaluation);
        return {
          id: player.id,
          evaluation
        };
      });
    };

    // Helper function to find winners at each stage
    const findWinners = (evaluations) => {
      const bestRank = Math.max(...evaluations.map(e => e.evaluation.rank));
      const bestHands = evaluations.filter(e => e.evaluation.rank === bestRank);
      // If same rank, compare values
      const bestValue = Math.max(...bestHands.map(e => e.evaluation.value));
      return bestHands
        .filter(e => e.evaluation.value === bestValue)
        .map(e => e.id);
    };

    const renderCards = (cards) => {
      if (!cards || cards.length === 0) return '';
      // Add validation to ensure cards exist
      return cards
        .filter(card => card && card.value && card.suit)
        .map(card => `${card.value}${card.suit}`)
        .join(', ');
    };

    return (
      <div className="mt-8 p-4 bg-slate-700 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Hand Summary</h2>
        {['preflop', 'flop', 'turn', 'river'].map(stage => {
          const stageEvaluations = evaluateStage(stage);
          const actualWinners = findWinners(stageEvaluations);
          const winningHand = stageEvaluations.find(e => e.id === actualWinners[0])?.evaluation;
          
          return (
            <div key={stage} className="mb-4 border-b border-slate-600 pb-2">
              <h3 className="font-semibold capitalize">{stage}:</h3>
              <div className="ml-4">
                <p className="text-gray-300">
                  Players marked: {stageWinners[stage].length > 0 
                    ? `${stageWinners[stage].join(', ')}`
                    : 'None'}
                </p>
                <p className="text-green-400">
                  Actually winning: Player(s) {actualWinners.join(', ')} 
                  {stage !== 'preflop' && winningHand && (
                    <>
                      <br />
                      <span className="ml-4 text-sm">
                        with {winningHand.name} ({renderCards(winningHand.cards)})
                      </span>
                    </>
                  )}
                </p>
              </div>
            </div>
          );
        })}
        <div className="mt-4 pt-4 border-t border-slate-600">
          <h3 className="font-semibold">Final Hands:</h3>
          {players.map(player => (
            <div key={player.id} className="mt-2">
              Player {player.id}: {player.evaluation?.name || 'Unknown'}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen p-8 bg-slate-800">
      <main className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Poker Helper</h1>
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
            {
              playerCount > 8 ? (
                <p className="text-red-500">Maximum 8 players</p>
              ) : (
                <button 
                onClick={startGame}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Start Game
              </button>
              )
            }
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
              <>
                <GameSummary />
                <button
                  onClick={startGame}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-4"
                >
                  New Hand
                </button>
              </>
            )}
          </div>
        )}

        <HandRankingsModal 
          isOpen={showRankings} 
          onClose={() => setShowRankings(false)} 
        />
      </main>
    </div>
  );
}
