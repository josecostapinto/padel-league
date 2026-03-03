import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const players = await prisma.player.findMany({
      orderBy: {
        name: 'asc'
      }
    })
    return NextResponse.json(players)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch players' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name } = body

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json({ error: 'Player name is required' }, { status: 400 })
    }

    const player = await prisma.player.create({
      data: {
        name: name.trim()
      }
    })

    return NextResponse.json(player, { status: 201 })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'A player with this name already exists' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Failed to create player' }, { status: 500 })
  }
}
