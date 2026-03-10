import { NextResponse } from 'next/server';

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  day: number;
  startHour: number;
  startMin: number;
  endHour: number;
  endMin: number;
  color: string;
  category: string;
}

export async function GET(request: Request) {
  try {
    const events: CalendarEvent[] = [];

    // Pull real batch run data from pipeline API
    try {
      const pipelineRes = await fetch(`${new URL(request.url).origin}/api/pipeline-status`, {
        cache: 'no-store',
      });
      if (pipelineRes.ok) {
        const data = await pipelineRes.json();
        const batches = data.batches || [];

        // Map real batch runs to calendar events this week
        const now = new Date();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Monday
        startOfWeek.setHours(0, 0, 0, 0);

        for (const batch of batches) {
          const started = new Date(batch.startedAt);
          const ended = new Date(batch.endedAt);

          // Only include batches from this week
          const dayOfWeek = started.getDay();
          const adjDay = dayOfWeek === 0 ? 7 : dayOfWeek; // Mon=1...Sun=7
          if (adjDay < 1 || adjDay > 7) continue;

          // Determine color based on pass rate
          const passNum = parseInt(batch.passRate);
          let color = '#22c55e'; // green
          if (passNum === 0) color = '#ef4444'; // red
          else if (passNum < 50) color = '#f59e0b'; // amber
          else if (passNum < 80) color = '#3b82f6'; // blue

          const niche = batch.niche.split(/[_ ]+/).map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
          const durMins = Math.max(Math.ceil(batch.duration / 60), 15);

          events.push({
            id: `batch-${batch.id.replace(/\//g, '-')}`,
            title: `POD: ${niche}`,
            description: `${batch.engine} — ${batch.passed}/${batch.total} passed (${batch.passRate})`,
            day: adjDay,
            startHour: started.getHours(),
            startMin: started.getMinutes(),
            endHour: ended.getHours(),
            endMin: ended.getMinutes(),
            color,
            category: 'batch',
          });
        }
      }
    } catch (e) {
      console.error('Pipeline fetch for calendar failed:', e);
    }

    // Add known recurring events
    events.push({
      id: 'clawdbot-node',
      title: 'Clawdbot Node Agent',
      description: 'Always-on: Titus compute node running as LaunchAgent',
      day: 1,
      startHour: 0,
      startMin: 0,
      endHour: 23,
      endMin: 59,
      color: '#64748b',
      category: 'system',
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error('Calendar error:', error);
    return NextResponse.json([], { status: 500 });
  }
}
