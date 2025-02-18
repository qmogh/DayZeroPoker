'use client'
import { useState, useEffect } from 'react';
import { HAND_GROUPS, getRandomHand, getHandGroup } from '@/utils/handGroups';

export default function HandGroupQuiz() {
  const [currentHand, setCurrentHand] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    newHand();
  }, []);

  const newHand = () => {
    setCurrentHand(getRandomHand());
    setSelectedGroup(null);
    setResult(null);
  };

  const checkAnswer = (groupId) => {
    const correctGroup = getHandGroup(currentHand);
    const isCorrect = correctGroup === groupId;
    
    setSelectedGroup(groupId);
    setResult(isCorrect);
    setScore(prev => isCorrect ? prev + 1 : prev);
    setTotal(prev => prev + 1);
  };

  return (
    <div className="min-h-screen p-8 bg-slate-800">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-white">Hand Group Quiz</h1>
        
        <div className="bg-slate-700 p-6 rounded-lg mb-8">
          <div className="text-center mb-6">
            <p className="text-sm text-slate-300 mb-2">Score: {score}/{total}</p>
            <h2 className="text-4xl font-bold text-white mb-4">{currentHand}</h2>
            {result !== null && (
              <p className={`text-lg ${result ? 'text-green-400' : 'text-red-400'}`}>
                {result ? 'Correct!' : 'Incorrect!'} This hand belongs to Group {getHandGroup(currentHand)}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {Object.entries(HAND_GROUPS).map(([groupId, group]) => (
              <button
                key={groupId}
                onClick={() => checkAnswer(groupId)}
                disabled={result !== null}
                className={`
                  p-4 rounded-lg text-left transition
                  ${selectedGroup === groupId 
                    ? result 
                      ? 'bg-green-500 text-white'
                      : 'bg-red-500 text-white'
                    : 'bg-slate-600 hover:bg-slate-500 text-white'
                  }
                `}
              >
                <div className="font-bold">Group {groupId}</div>
                <div className="text-sm">{group.name}</div>
                <div className="text-xs mt-1 opacity-75">{group.hands.join(', ')}</div>
              </button>
            ))}
          </div>

          {result !== null && (
            <button
              onClick={newHand}
              className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-lg mx-auto block hover:bg-blue-600"
            >
              Next Hand
            </button>
          )}
        </div>
      </main>
    </div>
  );
} 