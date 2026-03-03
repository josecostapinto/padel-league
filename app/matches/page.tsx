'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Match {
  id: string
  playedAt: string
  winner1: {
    id: string
    name: string
  }
  winner2: {
    id: string
    name: string
  }
  loser1: {
    id: string
    name: string
  }
  loser2: {
    id: string
    name: string
  }
}

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    fetchMatches()
  }, [])

  async function fetchMatches() {
    try {
      const res = await fetch('/api/matches?period=all')
      const data = await res.json()
      setMatches(data)
    } catch (error) {
      console.error('Failed to fetch matches:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(matchId: string) {
    try {
      const res = await fetch(`/api/matches/${matchId}`, {
        method: 'DELETE'
      })

      if (!res.ok) {
        throw new Error('Failed to delete match')
      }

      await fetchMatches()
      setDeleteConfirm(null)
    } catch (error) {
      console.error('Failed to delete match:', error)
      alert('Failed to delete match. Please try again.')
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <Link
                href="/"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium mb-3 transition-colors"
              >
                <span className="text-xl mr-2">←</span>
                Back to Leaderboard
              </Link>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-3">
                <span>📋</span>
                Match History
              </h1>
              <p className="text-gray-600 mt-1">All recorded matches</p>
            </div>
            <Link
              href="/matches/new"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              <span className="text-xl mr-2">➕</span>
              Add Match
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="bg-white rounded-2xl shadow-lg p-16 text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent mb-4"></div>
            <p className="text-gray-600 text-lg">Loading matches...</p>
          </div>
        ) : matches.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-16 text-center">
            <div className="text-8xl mb-6">🎾</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">No Matches Yet</h2>
            <p className="text-gray-600 mb-8">Get started by recording your first match!</p>
            <Link
              href="/matches/new"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
            >
              <span className="text-xl mr-2">➕</span>
              Add First Match
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {matches.map((match) => (
              <div
                key={match.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-200"
              >
                <div className="p-6">
                  {/* Date Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-gray-500">
                      <span className="text-xl">📅</span>
                      <span className="font-medium">{formatDate(match.playedAt)}</span>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/matches/${match.id}/edit`}
                        className="inline-flex items-center px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        <span className="mr-1">✏️</span>
                        Edit
                      </Link>
                      {deleteConfirm === match.id ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDelete(match.id)}
                            className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                          >
                            ✓ Confirm
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="inline-flex items-center px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-400 transition-colors"
                          >
                            ✕ Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(match.id)}
                          className="inline-flex items-center px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors"
                        >
                          <span className="mr-1">🗑️</span>
                          Delete
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Match Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Winners */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl">🏆</span>
                        <span className="text-sm font-bold text-green-700 uppercase tracking-wide">
                          Winners
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">👤</span>
                          <span className="text-lg font-semibold text-green-900">
                            {match.winner1.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">👤</span>
                          <span className="text-lg font-semibold text-green-900">
                            {match.winner2.name}
                          </span>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-green-200">
                        <span className="text-sm font-medium text-green-700">+3 points each</span>
                      </div>
                    </div>

                    {/* Losers */}
                    <div className="bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl">🎯</span>
                        <span className="text-sm font-bold text-red-700 uppercase tracking-wide">
                          Runners-up
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">👤</span>
                          <span className="text-lg font-semibold text-red-900">
                            {match.loser1.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">👤</span>
                          <span className="text-lg font-semibold text-red-900">
                            {match.loser2.name}
                          </span>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-red-200">
                        <span className="text-sm font-medium text-red-700">+1 point each</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
