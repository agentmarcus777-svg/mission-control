import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET() {
  try {
    const dataPath = join(process.cwd(), 'data', 'calendar.json');
    const raw = readFileSync(dataPath, 'utf-8');
    const events = JSON.parse(raw);
    return NextResponse.json(events);
  } catch (error) {
    console.error('Failed to read calendar data:', error);
    return NextResponse.json([], { status: 500 });
  }
}
