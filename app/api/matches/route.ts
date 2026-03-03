import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getDateRangeForPeriod } from '@/lib/scoring'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const period = searchParams.get('period') || 'all'

    const startDate = getDateRangeForPeriod(period)

    const matches = await prisma.match.findMany({
      where: startDate ? {
        playedAt: {
          gte: startDate
        }
      } : undefined,
      include: {
        winner1: true,
        winner2: true,
        loser1: true,
        loser2: true
      },
      orderBy: {
        playedAt: 'desc'
      }
    })

    return NextResponse.json(matches)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch matches' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { winner1Id, winner2Id, loser1Id, loser2Id, playedAt } = body

    if (!winner1Id || !winner2Id || !loser1Id || !loser2Id) {
      return NextResponse.json({ error: 'All four players are required' }, { status: 400 })
    }

    // Check for duplicate players
    const playerIds = [winner1Id, winner2Id, loser1Id, loser2Id]
    const uniquePlayerIds = new Set(playerIds)
    if (uniquePlayerIds.size !== 4) {
      return NextResponse.json({ error: 'All four players must be different' }, { status: 400 })
    }

    const match = await prisma.match.create({
      data: {
        winner1Id,
        winner2Id,
        loser1Id,
        loser2Id,
        playedAt: playedAt ? new Date(playedAt) : new Date()
      },
      include: {
        winner1: true,
        winner2: true,
        loser1: true,
        loser2: true
      }
    })

    return NextResponse.json(match, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create match' }, { status: 500 })
  }
}
