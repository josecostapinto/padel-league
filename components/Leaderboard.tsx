'use client'

import { PlayerStats } from '@/lib/scoring'

interface LeaderboardProps {
  standings: PlayerStats[]
}

export default function Leaderboard({ standings }: LeaderboardProps) {
  const getRankColor = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900'
    if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-900'
    if (rank === 3) return 'bg-gradient-to-r from-orange-400 to-orange-500 text-orange-900'
    return 'bg-gray-100 text-gray-700'
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return rank
  }

  return (
    <div className="overflow-x-auto">
      <div className="min-w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <div className="grid grid-cols-6 gap-4 text-xs font-bold text-white uppercase tracking-wider">
            <div className="text-center">Rank</div>
            <div className="col-span-2">Player</div>
            <div className="text-center">Matches</div>
            <div className="text-center">W/L</div>
            <div className="text-center">Points</div>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {standings.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="text-6xl mb-4">🎾</div>
              <p className="text-gray-500 text-lg">No matches recorded yet</p>
              <p className="text-gray-400 text-sm mt-2">Start by adding some matches!</p>
            </div>
          ) : (
            standings.map((player, index) => {
              const rank = index + 1
              const winRate = player.matchesPlayed > 0
                ? Math.round((player.wins / player.matchesPlayed) * 100)
                : 0

              return (
                <div
                  key={player.playerId}
                  className="group hover:bg-blue-50 transition-all duration-200"
                >
                  <div className="grid grid-cols-6 gap-4 px-6 py-4 items-center">
                    {/* Rank */}
                    <div className="flex justify-center">
                      <div className={`${getRankColor(rank)} w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-md`}>
                        {getRankIcon(rank)}
                      </div>
                    </div>

                    {/* Player Name */}
                    <div className="col-span-2">
                      <div className="font-semibold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
                        {player.playerName}
                      </div>
                      {player.matchesPlayed > 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                          Win rate: {winRate}%
                        </div>
                      )}
                    </div>

                    {/* Matches Played */}
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {player.matchesPlayed}
                      </div>
                      <div className="text-xs text-gray-500 uppercase">Games</div>
                    </div>

                    {/* Wins/Losses */}
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                          {player.wins}W
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                          {player.losses}L
                        </span>
                      </div>
                    </div>

                    {/* Points */}
                    <div className="text-center">
                      <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {player.totalPoints}
                      </div>
                      <div className="text-xs text-gray-500 uppercase">Points</div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
