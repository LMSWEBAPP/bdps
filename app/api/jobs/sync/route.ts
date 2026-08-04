import { NextResponse } from 'next/server';
import { sanityWriteClient } from '@/lib/sanity.write';

export const dynamic = 'force-dynamic';

const APP_ID = process.env.ADZUNA_APP_ID || 'ddb2fb63';
const APP_KEY = process.env.ADZUNA_APP_KEY || '138e3c87837a5ae7927652df146fb53a';

export async function fetchAndSyncAdzunaJobs() {
  try {
    const url = `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${APP_ID}&app_key=${APP_KEY}&results_per_page=50&sort_by=date&content-type=application/json`;

    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error(`Adzuna API Error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    const results = data.results || [];

    if (results.length === 0) {
      return { success: true, syncedCount: 0, message: 'No jobs returned from Adzuna API' };
    }

    const now = new Date().toISOString();
    let syncedCount = 0;
    const transaction = sanityWriteClient.transaction();

    for (const item of results) {
      const idStr = String(item.id);
      const doc = {
        _id: `job_adzuna_${idStr}`,
        _type: 'jobPosting',
        adzunaId: idStr,
        title: item.title?.replace(/<\/?[^>]+(>|$)/g, '') || 'Job Position',
        company: item.company?.display_name || 'Hiring Company',
        location: item.location?.display_name || 'India',
        category: item.category?.label || 'IT Jobs',
        description: item.description?.replace(/<\/?[^>]+(>|$)/g, '') || 'Job vacancy details in India.',
        salaryMin: item.salary_min ? Math.round(item.salary_min) : null,
        salaryMax: item.salary_max ? Math.round(item.salary_max) : null,
        redirectUrl: item.redirect_url || 'https://www.adzuna.in',
        postedAt: item.created || now,
        syncedAt: now,
      };

      transaction.createOrReplace(doc);
      syncedCount++;
    }

    await transaction.commit();

    return { success: true, syncedCount, total: results.length, message: `Successfully synced ${syncedCount} Indian jobs to Sanity CMS` };
  } catch (error: any) {
    console.error('Adzuna Jobs Sync Error:', error);
    return { success: false, error: error.message || 'Server error syncing jobs' };
  }
}

export async function GET(req: Request) {
  const result = await fetchAndSyncAdzunaJobs();
  return NextResponse.json(result, { status: result.success ? 200 : 500 });
}

export async function POST(req: Request) {
  const result = await fetchAndSyncAdzunaJobs();
  return NextResponse.json(result, { status: result.success ? 200 : 500 });
}
