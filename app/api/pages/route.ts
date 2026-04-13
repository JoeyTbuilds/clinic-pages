import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'

// DEMO MODE: In-memory until Supabase connected
export async function GET() {
  return NextResponse.json([])
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  // Generate a demo page ID
  const id = randomUUID()
  return NextResponse.json({ id })
}
