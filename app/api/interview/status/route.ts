// app/api/interview/status/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '../../../../utils/supabase/server'

export async function GET(req: NextRequest) {
  const url        = new URL(req.url)
  const roomId     = url.searchParams.get('roomId')
  if (!roomId) {
    return NextResponse.json({ error: 'Missing roomId' }, { status: 400 })
  }
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('interviews')
    .select('finished')
    .eq('id', roomId)
    .maybeSingle()
  console.log("Data inside status route",data)
  if (error || !data) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json({ finished: data.finished })
}
