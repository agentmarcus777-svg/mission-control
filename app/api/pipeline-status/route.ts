import { NextResponse } from 'next/server';
import { existsSync, readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const POD_API_URL = process.env.POD_PIPELINE_API_URL || 'http://127.0.0.1:3001/api/pipeline-status';
const POD_OUTPUT_DIR = process.env.POD_OUTPUT_DIR || '/Users/agentsecundus/clawd/projects/pod-tool/output';

function summarizeLocalOutput() {
  if (!existsSync(POD_OUTPUT_DIR)) {
    return null;
  }

  const dirs = readdirSync(POD_OUTPUT_DIR)
    .map((name) => join(POD_OUTPUT_DIR, name))
    .filter((path) => {
      try {
        return statSync(path).isDirectory();
      } catch {
        return false;
      }
    });

  let totalDesigns = 0;
  let passedDesigns = 0;
  let errorDesigns = 0;
  const batches: Array<Record<string, unknown>> = [];
  let lastUpdated: string | null = null;

  for (const dir of dirs) {
    const summaryPath = join(dir, 'batch_summary.json');
    if (!existsSync(summaryPath)) continue;
    try {
      const raw = JSON.parse(readFileSync(summaryPath, 'utf8'));
      const total = Number(raw.total || 0);
      const passed = Number(raw.passed || 0);
      const errors = Number(raw.errors || 0);
      totalDesigns += total;
      passedDesigns += passed;
      errorDesigns += errors;
      batches.push({
        id: raw.batch_id || dir.split('/').pop(),
        niche: raw.niche || 'unknown',
        engine: raw.engine || 'unknown',
        total,
        passed,
        errors,
        passRate: raw.pass_rate || (total > 0 ? `${Math.round((passed / total) * 100)}%` : '0%'),
        startedAt: raw.started_at || null,
        endedAt: raw.completed_at || raw.ended_at || null,
        duration: Number(raw.duration_seconds || 0),
      });
      const mtime = statSync(summaryPath).mtime.toISOString();
      if (!lastUpdated || mtime > lastUpdated) lastUpdated = mtime;
    } catch {
      // ignore malformed files
    }
  }

  const failedDesigns = Math.max(totalDesigns - passedDesigns - errorDesigns, 0);
  const avgScore = 0;

  return {
    pipelineStatus: batches.length ? 'local-fallback' : 'offline',
    totalDesigns,
    completedDesigns: passedDesigns + failedDesigns + errorDesigns,
    passedDesigns,
    failedDesigns,
    errorDesigns,
    batches,
    stats: {
      passed: passedDesigns,
      failed: failedDesigns,
      errors: errorDesigns,
      avgScore,
    },
    costs: {
      apollo: 0,
      nb2: 0,
      birefnet: 0,
      sentinel: 0,
    },
    lastUpdated: lastUpdated || new Date().toISOString(),
    source: 'local-output',
  };
}

export async function GET() {
  try {
    const res = await fetch(POD_API_URL, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      return NextResponse.json({ ...data, source: 'pipeline-api' });
    }
  } catch {
    // fall back below
  }

  const fallback = summarizeLocalOutput();
  if (fallback) {
    return NextResponse.json(fallback);
  }

  return NextResponse.json(
    {
      pipelineStatus: 'offline',
      totalDesigns: 0,
      completedDesigns: 0,
      passedDesigns: 0,
      failedDesigns: 0,
      errorDesigns: 0,
      batches: [],
      stats: { passed: 0, failed: 0, errors: 0, avgScore: 0 },
      costs: { apollo: 0, nb2: 0, birefnet: 0, sentinel: 0 },
      lastUpdated: new Date().toISOString(),
      source: 'none',
    },
    { status: 200 },
  );
}
