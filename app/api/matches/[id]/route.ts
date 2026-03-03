import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const match = await prisma.match.findUnique({
      where: { id },
      include: {
        winner1: true,
        winner2: true,
        loser1: true,
        loser2: true
      }
    })

    if (!match) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 })
    }

    return NextResponse.json(match)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch match' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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

    const match = await prisma.match.update({
      where: { id },
      data: {
        winner1Id,
        winner2Id,
        loser1Id,
        loser2Id,
        playedAt: playedAt ? new Date(playedAt) : undefined
      },
      include: {
        winner1: true,
        winner2: true,
        loser1: true,
        loser2: true
      }
    })

    return NextResponse.json(match)
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Failed to update match' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.match.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Match deleted successfully' })
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Failed to delete match' }, { status: 500 })
  }
}
