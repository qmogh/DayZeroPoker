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
  return (
    <div className="min-h-screen p-8 bg-slate-800">
      <main className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Day Zero Poker</h1>
          <p className="text-xl text-slate-300">Master the fundamentals of poker from day zero</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Poker Hand Trainer Card */}
          <a href="/poker-trainer" className="block h-full">
            <div className="bg-slate-700 p-6 rounded-lg hover:bg-slate-600 transition h-full flex flex-col">
              <h2 className="text-2xl font-bold text-white mb-3">Poker Hand Trainer</h2>
              <p className="text-slate-300 flex-grow mb-4">
                Practice identifying winning hands at each stage of Texas Hold'em. Perfect for learning hand rankings and board reading.
              </p>
              <div className="text-blue-400 font-semibold mt-auto">Start Training →</div>
            </div>
          </a>

          {/* Hand Groups Quiz Card */}
          <a href="/hand-groups" className="block h-full">
            <div className="bg-slate-700 p-6 rounded-lg hover:bg-slate-600 transition h-full flex flex-col">
              <h2 className="text-2xl font-bold text-white mb-3">Hand Groups Quiz</h2>
              <p className="text-slate-300 flex-grow mb-4">
                Learn which starting hands belong in which groups. Essential for pre-flop decision making.
              </p>
              <div className="text-blue-400 font-semibold mt-auto">Start Quiz →</div>
            </div>
          </a>
        </div>

        <div className="mt-12 text-center text-slate-400">
          <p>
            Built to help poker beginners master the fundamentals. 
            From hand rankings to starting hand selection, we've got you covered.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
