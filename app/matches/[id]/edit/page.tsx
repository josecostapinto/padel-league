'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'

interface Player {
  id: string
  name: string
}

interface Match {
  id: string
  winner1Id: string
  winner2Id: string
  loser1Id: string
  loser2Id: string
  playedAt: string
}

export default function EditMatchPage() {
  const router = useRouter()
  const params = useParams()
  const matchId = params.id as string

  const [players, setPlayers] = useState<Player[]>([])
  const [match, setMatch] = useState<Match | null>(null)
  const [winner1Id, setWinner1Id] = useState('')
  const [winner2Id, setWinner2Id] = useState('')
  const [loser1Id, setLoser1Id] = useState('')
  const [loser2Id, setLoser2Id] = useState('')
  const [playedAt, setPlayedAt] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchData()
  }, [matchId])

  async function fetchData() {
    try {
      const [playersRes, matchRes] = await Promise.all([
        fetch('/api/players'),
        fetch(`/api/matches/${matchId}`)
      ])

      const playersData = await playersRes.json()
      const matchData = await matchRes.json()

      setPlayers(playersData)
      setMatch(matchData)
      setWinner1Id(matchData.winner1Id)
      setWinner2Id(matchData.winner2Id)
      setLoser1Id(matchData.loser1Id)
      setLoser2Id(matchData.loser2Id)
      setPlayedAt(new Date(matchData.playedAt).toISOString().split('T')[0])
    } catch (error) {
      console.error('Failed to fetch data:', error)
      setError('Failed to load match data')
    } finally {
      setLoading(false)
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

    setSaving(true)

    try {
      const res = await fetch(`/api/matches/${matchId}`, {
        method: 'PUT',
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
        throw new Error(data.error || 'Failed to update match')
      }

      router.push('/matches')
    } catch (error: any) {
      setError(error.message)
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-lg p-12">
          <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading match...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/matches"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium mb-3 transition-colors"
          >
            <span className="text-xl mr-2">←</span>
            Back to Match History
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
            <span>✏️</span>
            Edit Match
          </h1>
          <p className="text-gray-600 mt-1">Update match details</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
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

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-bold text-lg hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {saving ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-r-transparent"></div>
                    Updating...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <span>✓</span>
                    Update Match
                  </span>
                )}
              </button>
              <Link
                href="/matches"
                className="px-8 py-4 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-colors text-center flex items-center"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
