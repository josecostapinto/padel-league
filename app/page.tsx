'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Leaderboard from '@/components/Leaderboard'
import TimeFilter from '@/components/TimeFilter'
import { calculateStandings, PlayerStats } from '@/lib/scoring'

export default function Home() {
  const [standings, setStandings] = useState<PlayerStats[]>([])
  const [period, setPeriod] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStandings()
  }, [period])

  async function fetchStandings() {
    try {
      setLoading(true)
      const [matchesRes, playersRes] = await Promise.all([
        fetch(`/api/matches?period=${period}`),
        fetch('/api/players')
      ])

      const matches = await matchesRes.json()
      const players = await playersRes.json()

      const calculatedStandings = calculateStandings(matches, players)
      setStandings(calculatedStandings)
    } catch (error) {
      console.error('Failed to fetch standings:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                🎾 Padel League
              </h1>
              <p className="text-gray-600 mt-1">Track matches, climb the rankings!</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/matches/new"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                <span className="text-xl mr-2">➕</span>
                Add Match
              </Link>
              <Link
                href="/players"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                <span className="text-xl mr-2">👥</span>
                Players
              </Link>
              <Link
                href="/matches"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                <span className="text-xl mr-2">📋</span>
                History
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Time Filter Section */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">🗓️</span>
              Filter by Period
            </h2>
            <TimeFilter currentPeriod={period} onPeriodChange={setPeriod} />
          </div>
        </div>

        {/* Leaderboard Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl">🏆</span>
            <h2 className="text-3xl font-bold text-gray-900">
              Standings
            </h2>
          </div>

          {loading ? (
            <div className="bg-white rounded-2xl shadow-lg p-16 text-center">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent mb-4"></div>
              <p className="text-gray-600 text-lg">Loading standings...</p>
            </div>
          ) : (
            <Leaderboard standings={standings} />
          )}
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">How It Works</h3>
            <p className="text-gray-600 text-sm">
              Win a match? Get 3 points. Lose? Still earn 1 point for participating!
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-3xl mb-3">👥</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Doubles Format</h3>
            <p className="text-gray-600 text-sm">
              Each match has 2 winners and 2 losers. Both teammates earn points!
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Track Progress</h3>
            <p className="text-gray-600 text-sm">
              View rankings by month, quarter, year, or all-time to see who's on top!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
