import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Adzuna API Sync is permanently disabled. Only custom admin-posted jobs in Sanity CMS are used.
export async function GET() {
  return NextResponse.json({
    success: true,
    syncedCount: 0,
    message: 'Adzuna Sync is permanently disabled. Jobs are managed manually via Sanity CMS.'
  });
}

export async function POST() {
  return NextResponse.json({
    success: true,
    syncedCount: 0,
    message: 'Adzuna Sync is permanently disabled. Jobs are managed manually via Sanity CMS.'
  });
}
