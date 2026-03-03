export interface PlayerStats {
  playerId: string
  playerName: string
  matchesPlayed: number
  wins: number
  losses: number
  totalPoints: number
}

export function calculateStandings(matches: any[], players: any[]): PlayerStats[] {
  const statsMap = new Map<string, PlayerStats>()

  // Initialize stats for all players
  players.forEach(player => {
    statsMap.set(player.id, {
      playerId: player.id,
      playerName: player.name,
      matchesPlayed: 0,
      wins: 0,
      losses: 0,
      totalPoints: 0
    })
  })

  // Calculate stats from matches
  matches.forEach(match => {
    // Winners
    const winner1Stats = statsMap.get(match.winner1Id)
    const winner2Stats = statsMap.get(match.winner2Id)

    if (winner1Stats) {
      winner1Stats.wins += 1
      winner1Stats.matchesPlayed += 1
      winner1Stats.totalPoints += 3 // 3 points for win
    }

    if (winner2Stats) {
      winner2Stats.wins += 1
      winner2Stats.matchesPlayed += 1
      winner2Stats.totalPoints += 3 // 3 points for win
    }

    // Losers
    const loser1Stats = statsMap.get(match.loser1Id)
    const loser2Stats = statsMap.get(match.loser2Id)

    if (loser1Stats) {
      loser1Stats.losses += 1
      loser1Stats.matchesPlayed += 1
      loser1Stats.totalPoints += 1 // 1 point for loss
    }

    if (loser2Stats) {
      loser2Stats.losses += 1
      loser2Stats.matchesPlayed += 1
      loser2Stats.totalPoints += 1 // 1 point for loss
    }
  })

  // Convert to array and sort
  const standings = Array.from(statsMap.values())
    .sort((a, b) => {
      // Sort by points descending
      if (b.totalPoints !== a.totalPoints) {
        return b.totalPoints - a.totalPoints
      }
      // Then by name alphabetically
      return a.playerName.localeCompare(b.playerName)
    })

  return standings
}

export function getDateRangeForPeriod(period: string): Date | null {
  const now = new Date()

  switch (period) {
    case 'month':
      // Start of current month
      return new Date(now.getFullYear(), now.getMonth(), 1)

    case 'quarter':
      // Start of current quarter
      const currentMonth = now.getMonth()
      const quarterStartMonth = Math.floor(currentMonth / 3) * 3
      return new Date(now.getFullYear(), quarterStartMonth, 1)

    case 'year':
      // Start of current year
      return new Date(now.getFullYear(), 0, 1)

    case 'all':
    default:
      return null // No filter, return all matches
  }
}
