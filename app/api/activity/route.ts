import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET() {
  try {
    const dataPath = join(process.cwd(), 'data', 'activity.json');
    const raw = readFileSync(dataPath, 'utf-8');
    const activities = JSON.parse(raw);
    return NextResponse.json(activities);
  } catch (error) {
    console.error('Failed to read activity data:', error);
    return NextResponse.json([], { status: 500 });
  }
}
