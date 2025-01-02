'use client'
import { useState, useMemo } from "react";
import { dealCards } from "@/utils/deck";
import PlayerHand from "@/components/PlayerHand";
import CommunityCards from "@/components/CommunityCards";
import { evaluateHand } from '@/utils/pokerEvaluator';
import HandRankingsModal from "@/components/HandRankingsModal";
import { testHandEvaluation } from '@/utils/testPokerEvaluator';
import Footer from '@/components/Footer';
import { calculateWinningOdds } from '@/utils/oddsCalculator';
import ViewCounter from '@/components/ViewCounter';
import { Analytics } from "@vercel/analytics/react"

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
  const [showPottOdds, setShowPottOdds] = useState(false);
  const [odds, setOdds] = useState({});

  const startGame = () => {
    setStageWinners({
      preflop: [],
      flop: [],
      turn: [],
      river: []
    });
    setShowPottOdds(false);
    setOdds({});
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
    const nextStageValue = stages[currentIndex + 1];
    
    // Calculate odds for each player before updating stage
    if (nextStageValue !== 'complete') {
      const playerOdds = players.reduce((acc, player) => {
        const calculatedOdds = calculateWinningOdds(
          player.cards,
          communityCards,
          players.length
        );
        acc[player.id] = calculatedOdds;
        return acc;
      }, {});
      
      setOdds(playerOdds);
    }

    // Carry forward winners from current stage to next stage
    if (nextStageValue !== 'complete') {
      setStageWinners(prev => ({
        ...prev,
        [nextStageValue]: prev[gameStage]
      }));
    }
    
    // Deal cards only for specific stages
    switch(nextStageValue) {
      case 'flop':
        const flop = [deck[0], deck[1], deck[2]];
        console.log('Dealing flop:', flop.map(c => `${c.value}${c.suit}`));
        setCommunityCards(flop);
        setDeck(prev => prev.slice(3));
        break;
      case 'turn':
      case 'river':
        const newCard = deck[0];
        console.log(`Dealing ${nextStageValue}:`, `${newCard.value}${newCard.suit}`);
        setCommunityCards(prev => [...prev, newCard]);
        setDeck(prev => prev.slice(1));
        break;
      case 'complete':
        // Don't deal any cards, just evaluate final hands
        const playerHands = players.map(player => ({
          ...player,
          evaluation: evaluateHand(player.cards, communityCards)
        }));
        setPlayers(playerHands);
        break;
    }
    
    // Also carry forward the isWinning status for players
    setPlayers(prev => prev.map(player => ({
      ...player,
      isWinning: stageWinners[gameStage].includes(player.id)
    })));
    
    setGameStage(nextStageValue);
  };

  const toggleWinner = (playerId) => {
    setPlayers(prev => prev.map(player => ({
      ...player,
      isWinning: player.id === playerId ? !player.isWinning : player.isWinning
    })));

    setStageWinners(prev => {
      const currentWinners = new Set(prev[gameStage] || []);
      
      if (currentWinners.has(playerId)) {
        currentWinners.delete(playerId);
      } else {
        currentWinners.add(playerId);
      }
      
      return {
        ...prev,
        [gameStage]: Array.from(currentWinners)
      };
    });
  };

  // Move findWinners outside of GameSummary
  const findWinners = (evaluations) => {
    if (!evaluations || evaluations.length === 0) return [];
    
    return evaluations.reduce((winners, current) => {
      if (!current.evaluation) return winners;
      
      if (winners.length === 0) return [current];
      
      const first = winners[0];
      if (!first.evaluation) return [current];
      
      // Compare primary rank
      if (current.evaluation.rank > first.evaluation.rank) return [current];
      if (current.evaluation.rank < first.evaluation.rank) return winners;
      
      // Compare main value
      if (current.evaluation.value > first.evaluation.value) return [current];
      if (current.evaluation.value < first.evaluation.value) return winners;
      
      // Compare kickers if they exist
      if (current.evaluation.kickers && first.evaluation.kickers) {
        for (let i = 0; i < current.evaluation.kickers.length; i++) {
          if (current.evaluation.kickers[i] > first.evaluation.kickers[i]) return [current];
          if (current.evaluation.kickers[i] < first.evaluation.kickers[i]) return winners;
        }
      }
      
      // If we get here, it's a true tie
      return [...winners, current];
    }, []);
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

    const renderCards = (cards) => {
      if (!cards || cards.length === 0) return '';
      // Add validation to ensure cards exist
      return cards
        .filter(card => card && card.value && card.suit)
        .map(card => `${card.value}${card.suit}`)
        .join(', ');
    };

    const renderWinningHands = (evaluations, winners) => {
      if (winners.length === 0) return null;
      
      const isTie = winners.length > 1;
      
      return (
        <div className="ml-4">
          <Analytics />
          {isTie && (
            <div className="text-yellow-400 font-bold mb-2">
              🏆 Tie Game! Multiple Winners 🏆
            </div>
          )}
          {winners.map(winnerId => {
            const winningHand = evaluations.find(e => e.id === winnerId)?.evaluation;
            if (!winningHand) return null;
            return (
              <span key={winnerId} className="block text-sm">
                Player {winnerId}: {winningHand.name} ({renderCards(winningHand.cards)})
              </span>
            );
          })}
        </div>
      );
    };

    const stageEvaluations = useMemo(() => ({
      preflop: evaluateStage('preflop'),
      flop: evaluateStage('flop'),
      turn: evaluateStage('turn'),
      river: evaluateStage('river')
    }), [players, communityCards]); // Add dependencies based on what evaluateStage uses

    const stageWinnersList = useMemo(() => ({
      preflop: findWinners(stageEvaluations.preflop),
      flop: findWinners(stageEvaluations.flop),
      turn: findWinners(stageEvaluations.turn),
      river: findWinners(stageEvaluations.river)
    }), [stageEvaluations]);

    return (
      <div className="mt-8 p-4 bg-slate-700 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Hand Summary</h2>
        {['preflop', 'flop', 'turn', 'river'].map(stage => {
          const stageEvaluations = evaluateStage(stage);
          const actualWinners = findWinners(stageEvaluations);
          
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
                  Actually winning: Player(s) {actualWinners.map(w => w.id).join(', ')}
                  {stage !== 'preflop' && (
                    <>
                      <br />
                      {renderWinningHands(stageEvaluations, actualWinners.map(w => w.id))}
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

  const runTests = () => {
    console.clear();
    testHandEvaluation();
  };

  return (
    <div className="min-h-screen p-8 bg-slate-800">
      <main className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold mb-8 text-white">Who's Winning? Poker Hand Trainer</h1>
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
                <p className="mt-4">
                  Use the "Show Hand Rankings" button anytime to view poker hand rankings from Royal Flush to High Card.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block mb-2">Number of Players (2-10):</label>
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
                playerCount > 10 ? (
                  <p className="text-red-500">Maximum 10 players</p>
                ) : playerCount < 2 ? (
                  <p className="text-red-500">Minimum 2 players</p>
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
          </div>
        )}

        {gameStage !== 'setup' && (
          <div className="space-y-8">
            <CommunityCards cards={communityCards} gameStage={gameStage} />
            
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {players.map((player) => {
                const winners = gameStage === 'complete' 
                  ? findWinners(players.map(p => ({ id: p.id, evaluation: p.evaluation })))
                  : [];
                const isWinner = winners.some(w => w.id === player.id);
                const isTie = winners.length > 1;
                const playerOdds = odds[player.id];

                return (
                  <PlayerHand 
                    key={player.id} 
                    player={player}
                    onToggleWinner={toggleWinner}
                    isOverallWinner={isWinner}
                    gameStage={gameStage}
                    odds={playerOdds}
                    showOdds={showPottOdds}
                  />
                );
              })}
            </div>

            <div className="flex gap-4">
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
              {gameStage !== 'complete' && gameStage !== 'preflop' && (
                <button
                  onClick={() => setShowPottOdds(!showPottOdds)}
                  className="bg-orange-300 text-white px-4 py-2 rounded hover:bg-orange-400"
                >
                  {showPottOdds ? 'Hide Pot Odds' : 'Show Pot Odds'}
                </button>
              )}
            </div>

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

        {process.env.NODE_ENV === 'development' && (
          <button
            onClick={runTests}
            className="bg-purple-500 text-white mt-5 px-4 py-2 rounded hover:bg-purple-600"
          >
            Run Hand Tests
          </button>
        )}
      </main>
      <Footer />
      {gameStage === 'setup' && <ViewCounter />}
    </div>
  );
}
