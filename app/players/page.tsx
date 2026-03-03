'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Player {
  id: string
  name: string
  createdAt: string
}

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([])
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchPlayers()
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
    setSuccess('')
    setLoading(true)

    try {
      const res = await fetch('/api/players', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to create player')
      }

      setSuccess(`${name} added successfully!`)
      setName('')
      await fetchPlayers()

      setTimeout(() => setSuccess(''), 3000)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium mb-3 transition-colors"
          >
            <span className="text-xl mr-2">←</span>
            Back to Leaderboard
          </Link>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
            <span>👥</span>
            Manage Players
          </h1>
          <p className="text-gray-600 mt-1">Add and view all league members</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add Player Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">➕</span>
            <h2 className="text-2xl font-bold text-gray-900">
              Add New Player
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter player name..."
                className="flex-1 px-6 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-r-transparent"></div>
                    Adding...
                  </div>
                ) : (
                  'Add Player'
                )}
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl">⚠️</span>
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl">✓</span>
                  <p className="text-green-700 font-medium">{success}</p>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Players List */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎾</span>
              <h2 className="text-2xl font-bold text-gray-900">
                All Players
              </h2>
            </div>
            <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-semibold">
              {players.length} {players.length === 1 ? 'player' : 'players'}
            </span>
          </div>

          {players.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👥</div>
              <p className="text-gray-500 text-lg">No players added yet.</p>
              <p className="text-gray-400 text-sm mt-2">Add your first player above!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {players.map((player, index) => (
                <div
                  key={player.id}
                  className="group bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-100 rounded-xl p-5 hover:shadow-lg hover:scale-105 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">
                      {player.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
                        {player.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Player #{index + 1}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
