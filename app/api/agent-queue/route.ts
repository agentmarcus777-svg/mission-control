import { NextResponse } from 'next/server';
import { existsSync, readFileSync } from 'fs';

const TITUS_TASKS_FILE = process.env.TITUS_TASKS_FILE || '/Users/agentsecundus/clawd/ACTIVE-TASKS.md';
const MARCUS_TASKS_FILE = process.env.MARCUS_TASKS_FILE || '/Users/agentprime/clawd/ACTIVE-TASKS.md';

interface AgentTask {
  id: string;
  title: string;
  status: string;
  priority: string;
  notes: string;
  deadline: string;
}

interface AgentSnapshot {
  agent: string;
  source: 'local' | 'remote-file' | 'unavailable';
  currentTask: AgentTask | null;
  activeTasks: AgentTask[];
  summary: string;
}

function parseTasksFile(path: string): AgentTask[] {
  if (!existsSync(path)) return [];
  const text = readFileSync(path, 'utf8');
  const lines = text.split('\n').filter((line) => line.startsWith('| T'));

  return lines
    .map((line) => line.split('|').map((part) => part.trim()))
    .filter((parts) => parts.length >= 9)
    .map((parts) => ({
      id: parts[1],
      title: parts[2],
      status: parts[3],
      priority: parts[4],
      deadline: parts[7],
      notes: parts[8],
    }));
}

function priorityRank(priority: string) {
  const ranks: Record<string, number> = { p0: 0, p1: 1, p2: 2, p3: 3 };
  return ranks[priority] ?? 9;
}

function buildSnapshot(agent: string, path: string, source: AgentSnapshot['source']): AgentSnapshot {
  const tasks = parseTasksFile(path)
    .filter((task) => task.status !== 'done' && task.status !== 'failed')
    .sort((a, b) => {
      const p = priorityRank(a.priority) - priorityRank(b.priority);
      if (p !== 0) return p;
      return a.deadline.localeCompare(b.deadline);
    });

  const currentTask = tasks.find((task) => task.status === 'in_progress') || tasks[0] || null;
  const summary = currentTask
    ? `${currentTask.priority.toUpperCase()} ${currentTask.status.replace('_', ' ')} — ${currentTask.title}`
    : 'No active tasks';

  return {
    agent,
    source,
    currentTask,
    activeTasks: tasks.slice(0, 6),
    summary,
  };
}

export async function GET() {
  const titus = buildSnapshot('TITUS', TITUS_TASKS_FILE, 'local');

  let marcus: AgentSnapshot;
  if (existsSync(MARCUS_TASKS_FILE)) {
    marcus = buildSnapshot('MARCUS', MARCUS_TASKS_FILE, 'remote-file');
  } else {
    marcus = {
      agent: 'MARCUS',
      source: 'unavailable',
      currentTask: null,
      activeTasks: [],
      summary: 'Marcus task feed unavailable — set MARCUS_TASKS_FILE on deploy host',
    };
  }

  return NextResponse.json({ agents: [marcus, titus] });
}
