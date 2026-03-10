import { NextResponse } from 'next/server';

interface PipelineBatch {
  id: string;
  niche: string;
  engine: string;
  total: number;
  passed: number;
  trashed: number;
  errors: number;
  passRate: string;
  startedAt: string;
  endedAt: string;
  duration: number;
}

interface PipelineData {
  pipelineStatus: string;
  totalDesigns: number;
  completedDesigns: number;
  passedDesigns: number;
  failedDesigns: number;
  errorDesigns: number;
  batches: PipelineBatch[];
  stats: { passed: number; failed: number; errors: number; avgScore: number };
  costs: Record<string, number>;
  lastUpdated: string;
}

function formatNiche(niche: string): string {
  return niche.split(/[_ ]+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins}m`;
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

export async function GET(request: Request) {
  try {
    // Fetch real data from POD Pipeline API
    const pipelineRes = await fetch(`${new URL(request.url).origin}/api/pipeline-status`, {
      cache: 'no-store',
    });

    const activities: Array<{
      id: string;
      time: string;
      message: string;
      type: 'success' | 'info' | 'warning' | 'error';
      source: string;
    }> = [];

    if (pipelineRes.ok) {
      const data: PipelineData = await pipelineRes.json();

      // Add pipeline status as first item
      activities.push({
        id: 'pipeline-status',
        time: data.lastUpdated || new Date().toISOString(),
        message: `Pipeline ${data.pipelineStatus}: ${data.totalDesigns} total designs, ${data.passedDesigns} passed, ${data.errorDesigns} errors`,
        type: data.pipelineStatus === 'complete' ? 'success' : 'info',
        source: 'PIPELINE',
      });

      // Convert each batch to an activity event (sorted by endedAt desc)
      const sortedBatches = [...data.batches].sort(
        (a, b) => new Date(b.endedAt).getTime() - new Date(a.endedAt).getTime()
      );

      for (const batch of sortedBatches) {
        const niche = formatNiche(batch.niche);
        const dur = formatDuration(batch.duration);
        const passRate = batch.passRate;
        let type: 'success' | 'info' | 'warning' | 'error' = 'info';
        if (batch.errors === batch.total) type = 'error';
        else if (parseInt(passRate) >= 70) type = 'success';
        else if (parseInt(passRate) >= 40) type = 'warning';
        else type = 'error';

        activities.push({
          id: `batch-${batch.id.replace(/\//g, '-')}`,
          time: batch.endedAt,
          message: `Batch "${niche}" (${batch.engine}) — ${batch.passed}/${batch.total} passed (${passRate}), ${dur}`,
          type,
          source: 'POD',
        });
      }

      // Add cost summary
      const totalCost = Object.values(data.costs).reduce((a, b) => a + b, 0);
      activities.push({
        id: 'costs-summary',
        time: data.lastUpdated || new Date().toISOString(),
        message: `Pipeline costs: $${totalCost.toFixed(2)} total (Apollo $${data.costs.apollo}, NB2 $${data.costs.nb2}, BiRefNet $${data.costs.birefnet}, Sentinel $${data.costs.sentinel})`,
        type: 'info',
        source: 'COSTS',
      });
    } else {
      activities.push({
        id: 'pipeline-offline',
        time: new Date().toISOString(),
        message: 'POD Pipeline API unreachable (port 3001)',
        type: 'error',
        source: 'SYSTEM',
      });
    }

    return NextResponse.json(activities);
  } catch (error) {
    console.error('Failed to fetch activity data:', error);
    return NextResponse.json([{
      id: 'error',
      time: new Date().toISOString(),
      message: `Activity feed error: ${error instanceof Error ? error.message : 'Unknown'}`,
      type: 'error',
      source: 'SYSTEM',
    }], { status: 200 });
  }
}
