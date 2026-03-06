import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = (searchParams.get('q') || '').toLowerCase();
    const filter = searchParams.get('filter') || 'all';

    const dataPath = join(process.cwd(), 'data', 'search-index.json');
    const raw = readFileSync(dataPath, 'utf-8');
    let items = JSON.parse(raw);

    if (filter !== 'all') {
      items = items.filter((item: { type: string }) => item.type === filter);
    }

    if (query) {
      items = items.filter((item: { content: string; source: string }) =>
        item.content.toLowerCase().includes(query) ||
        item.source.toLowerCase().includes(query)
      );
    }

    return NextResponse.json(items);
  } catch (error) {
    console.error('Failed to search:', error);
    return NextResponse.json([], { status: 500 });
  }
}
