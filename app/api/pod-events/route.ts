import { NextResponse } from 'next/server';

const events = [
  {
    id: 'mothers-day-push',
    title: 'Mother\'s Day POD Push',
    date: '2026-04-15',
    type: 'seasonal',
    note: 'Front-load mama/mom, floral, sentimental gift graphics.',
  },
  {
    id: 'spring-western',
    title: 'Spring Western Drop',
    date: '2026-03-18',
    type: 'seasonal',
    note: 'Western, celestial, nature crossover for women 25–45.',
  },
  {
    id: 'summer-vacation',
    title: 'Summer Travel / Lake Calendar',
    date: '2026-04-01',
    type: 'planning',
    note: 'Prep lake, beach, camp, road-trip design sets.',
  },
  {
    id: 'maurices-followup',
    title: 'Maurices / Liv Follow-up',
    date: '2026-03-12',
    type: 'deadline',
    note: 'Retail intel synthesis and generic graphics recommendations.',
  },
];

export async function GET() {
  return NextResponse.json(events);
}
