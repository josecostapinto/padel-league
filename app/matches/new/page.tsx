'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Player {
  id: string
  name: string
}

export default function NewMatchPage() {
  const router = useRouter()
  const [players, setPlayers] = useState<Player[]>([])
  const [winner1Id, setWinner1Id] = useState('')
  const [winner2Id, setWinner2Id] = useState('')
  const [loser1Id, setLoser1Id] = useState('')
  const [loser2Id, setLoser2Id] = useState('')
  const [playedAt, setPlayedAt] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchPlayers()
    const today = new Date().toISOString().split('T')[0]
    setPlayedAt(today)
  }, [])

  async function fetchPlayers() {
    try {
      const res = await fetch('/api/players')
      const data = await res.json()
      setPlayers(data)
    } catch (error) {
      console.error('Failed to fetch players:', error)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!winner1Id || !winner2Id || !loser1Id || !loser2Id) {
      setError('Please select all four players')
      return
    }

    const playerIds = [winner1Id, winner2Id, loser1Id, loser2Id]
    const uniquePlayerIds = new Set(playerIds)
    if (uniquePlayerIds.size !== 4) {
      setError('All four players must be different')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          winner1Id,
          winner2Id,
          loser1Id,
          loser2Id,
          playedAt: new Date(playedAt).toISOString()
        })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to create match')
      }

      router.push('/')
    } catch (error: any) {
      setError(error.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium mb-3 transition-colors"
          >
            <span className="text-xl mr-2">←</span>
            Back to Leaderboard
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent flex items-center gap-3">
            <span>➕</span>
            Add New Match
          </h1>
          <p className="text-gray-600 mt-1">Record a doubles match result</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {players.length < 4 ? (
            <div className="text-center py-12">
              <div className="text-8xl mb-6">👥</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Need More Players</h2>
              <p className="text-gray-600 mb-8">
                You need at least 4 players to record a doubles match.
              </p>
              <Link
                href="/players"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                <span className="text-xl mr-2">👥</span>
                Add Players
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Winning Team */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl">🏆</span>
                  <h2 className="text-2xl font-bold text-green-900">
                    Winning Team
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="winner1" className="block text-sm font-semibold text-green-900 mb-2">
                      Winner 1
                    </label>
                    <select
                      id="winner1"
                      value={winner1Id}
                      onChange={(e) => setWinner1Id(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900 font-medium"
                      required
                    >
                      <option value="">Select player...</option>
                      {players.map((player) => (
                        <option key={player.id} value={player.id}>
                          {player.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="winner2" className="block text-sm font-semibold text-green-900 mb-2">
                      Winner 2
                    </label>
                    <select
                      id="winner2"
                      value={winner2Id}
                      onChange={(e) => setWinner2Id(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900 font-medium"
                      required
                    >
                      <option value="">Select player...</option>
                      {players.map((player) => (
                        <option key={player.id} value={player.id}>
                          {player.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-green-700 text-sm font-medium">
                  <span>💰</span>
                  <span>Each winner earns 3 points</span>
                </div>
              </div>

              {/* Losing Team */}
              <div className="bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl">🎯</span>
                  <h2 className="text-2xl font-bold text-red-900">
                    Losing Team
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="loser1" className="block text-sm font-semibold text-red-900 mb-2">
                      Loser 1
                    </label>
                    <select
                      id="loser1"
                      value={loser1Id}
                      onChange={(e) => setLoser1Id(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-red-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-gray-900 font-medium"
                      required
                    >
                      <option value="">Select player...</option>
                      {players.map((player) => (
                        <option key={player.id} value={player.id}>
                          {player.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="loser2" className="block text-sm font-semibold text-red-900 mb-2">
                      Loser 2
                    </label>
                    <select
                      id="loser2"
                      value={loser2Id}
                      onChange={(e) => setLoser2Id(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-red-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white text-gray-900 font-medium"
                      required
                    >
                      <option value="">Select player...</option>
                      {players.map((player) => (
                        <option key={player.id} value={player.id}>
                          {player.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-red-700 text-sm font-medium">
                  <span>💰</span>
                  <span>Each loser earns 1 point</span>
                </div>
              </div>

              {/* Match Date */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">📅</span>
                  <label htmlFor="date" className="text-lg font-semibold text-gray-900">
                    Match Date
                  </label>
                </div>
                <input
                  type="date"
                  id="date"
                  value={playedAt}
                  onChange={(e) => setPlayedAt(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 font-medium"
                  required
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">⚠️</span>
                    <p className="text-red-700 font-medium">{error}</p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-r-transparent"></div>
                    Saving Match...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span>✓</span>
                    Save Match
                  </span>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
