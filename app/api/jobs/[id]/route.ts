import { NextResponse } from 'next/server';
import { sanityClient } from '@/lib/sanity.client';

export const dynamic = 'force-dynamic';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const jobId = params?.id;
    if (!jobId) {
      return NextResponse.json({ success: false, message: 'Job ID is required' }, { status: 400 });
    }

    const query = `*[_type == "jobPosting" && _id == $id && !defined(adzunaId) && !(_id match "job_adzuna_*")][0] {
      _id,
      adzunaId,
      isCustom,
      title,
      company,
      location,
      category,
      jobType,
      experienceRequired,
      description,
      responsibilities,
      requirements,
      skills,
      salaryMin,
      salaryMax,
      redirectUrl,
      contactEmail,
      postedAt,
      syncedAt
    }`;

    const job = await sanityClient.fetch(query, { id: jobId }, { cache: 'no-store' });

    if (!job || (job.redirectUrl && job.redirectUrl.includes('adzuna.in'))) {
      return NextResponse.json({ success: false, message: 'Job posting not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      job
    });
  } catch (error: any) {
    console.error('Error fetching single job API:', error);
    return NextResponse.json({ success: false, message: error.message || 'Server error' }, { status: 500 });
  }
}
