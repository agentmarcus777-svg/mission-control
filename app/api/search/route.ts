import { NextResponse } from 'next/server';
import { readdirSync, readFileSync, statSync } from 'fs';
import { join, basename } from 'path';

interface SearchItem {
  id: string;
  type: string;
  content: string;
  source: string;
  timestamp: string;
}

function scanBatchLogs(outputDir: string): SearchItem[] {
  const items: SearchItem[] = [];
  try {
    const dirs = readdirSync(outputDir);
    for (const dir of dirs) {
      const dirPath = join(outputDir, dir);
      const stat = statSync(dirPath);
      if (!stat.isDirectory()) continue;

      // Check for batch_summary.json
      try {
        const summaryPath = join(dirPath, 'batch_summary.json');
        const raw = readFileSync(summaryPath, 'utf-8');
        const summary = JSON.parse(raw);
        items.push({
          id: `batch-${dir}`,
          type: 'batch',
          content: `Batch "${dir}": ${summary.niche || 'unknown'} niche, ${summary.passed}/${summary.total} passed (${summary.pass_rate}), engine: ${summary.engine}`,
          source: `pod-tool-v6/output/${dir}`,
          timestamp: stat.mtime.toISOString(),
        });
      } catch { /* no summary */ }

      // Check for combined_summary.json
      try {
        const combinedPath = join(dirPath, 'combined_summary.json');
        const raw = readFileSync(combinedPath, 'utf-8');
        const combined = JSON.parse(raw);
        items.push({
          id: `combined-${dir}`,
          type: 'batch',
          content: `Combined batch "${dir}": ${combined.total_passed} passed out of ${combined.total_designs} total, ${Object.keys(combined.batches || {}).join(', ')} niches`,
          source: `pod-tool-v6/output/${dir}`,
          timestamp: combined.date || stat.mtime.toISOString(),
        });
      } catch { /* no combined summary */ }

      // Scan for batch log JSON files
      try {
        const scanDir = (d: string) => {
          const files = readdirSync(d);
          for (const f of files) {
            const fp = join(d, f);
            const s = statSync(fp);
            if (s.isDirectory()) {
              scanDir(fp);
            } else if (f.startsWith('batch_log_') && f.endsWith('.json')) {
              try {
                const raw = readFileSync(fp, 'utf-8');
                const log = JSON.parse(raw);
                items.push({
                  id: `log-${f}`,
                  type: 'batch',
                  content: `Batch log ${f}: ${log.niche || 'unknown'} niche, ${log.passed || 0} passed, ${log.total || 0} total, engine: ${log.engine || 'unknown'}`,
                  source: fp.replace('/Users/agentsecundus/', ''),
                  timestamp: s.mtime.toISOString(),
                });
              } catch { /* parse error */ }
            }
          }
        };
        scanDir(dirPath);
      } catch { /* scan error */ }
    }
  } catch { /* dir not found */ }
  return items;
}

function scanPipelineStatus(): SearchItem[] {
  const items: SearchItem[] = [];
  try {
    // We'll fetch from pipeline API synchronously isn't possible,
    // so we include what we can from local files
    const podToolDir = '/Users/agentsecundus/pod-tool-v6';
    const files = ['agent_pipeline.py', 'pipeline_server.py', 'config.py'];
    for (const f of files) {
      try {
        const fp = join(podToolDir, f);
        const stat = statSync(fp);
        const content = readFileSync(fp, 'utf-8').slice(0, 500);
        const firstComment = content.split('\n').filter((l: string) => l.startsWith('#')).slice(0, 3).join(' | ');
        items.push({
          id: `src-${f}`,
          type: 'file',
          content: `Pipeline source: ${f} — ${firstComment || 'V6/V7 POD pipeline code'}`,
          source: `pod-tool-v6/${f}`,
          timestamp: stat.mtime.toISOString(),
        });
      } catch { /* file not found */ }
    }
  } catch { /* dir error */ }
  return items;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = (searchParams.get('q') || '').toLowerCase();
    const filter = searchParams.get('filter') || 'all';

    // Build live search index from real sources
    let items: SearchItem[] = [];

    // 1. Batch logs from POD pipeline output
    items = items.concat(scanBatchLogs('/Users/agentsecundus/pod-tool-v6/output'));

    // 2. Pipeline source files
    items = items.concat(scanPipelineStatus());

    // 3. Add system info
    items.push({
      id: 'sys-titus',
      type: 'system',
      content: 'Titus (Mac Mini M4 Pro, 24GB RAM) — POD pipeline compute node, Mission Control display',
      source: 'System',
      timestamp: new Date().toISOString(),
    });
    items.push({
      id: 'sys-marcus',
      type: 'system',
      content: 'Marcus (Mac Mini M4) — Primary AI agent, orchestrator, brain node at 192.168.81.76',
      source: 'System',
      timestamp: new Date().toISOString(),
    });
    items.push({
      id: 'sys-pipeline',
      type: 'system',
      content: 'POD Pipeline V7: SCOUT (scraper) → PRISM (curator) → APOLLO (designer) → H2H (NB2+GPT) → SENTINEL (judge)',
      source: 'System',
      timestamp: new Date().toISOString(),
    });

    // Apply filters
    if (filter !== 'all') {
      items = items.filter(item => item.type === filter);
    }

    if (query) {
      items = items.filter(item =>
        item.content.toLowerCase().includes(query) ||
        item.source.toLowerCase().includes(query)
      );
    }

    return NextResponse.json(items);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json([], { status: 500 });
  }
}
