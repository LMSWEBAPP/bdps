import { NextResponse } from 'next/server';
import { sanityClient } from '@/lib/sanity.client';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.toLowerCase() || '';
    const category = searchParams.get('category') || 'All';
    const location = searchParams.get('location') || 'All';

    // Fetch jobs from Sanity CMS (only custom manually posted jobs)
    const query = `*[_type == "jobPosting" && (!defined(adzunaId) || isCustom == true)] | order(postedAt desc) [0...100] {
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

    let jobs = await sanityClient.fetch(query, {}, { cache: 'no-store' });

    // Apply filtering in memory
    let filtered = jobs || [];

    if (search.trim()) {
      filtered = filtered.filter((j: any) => 
        j.title?.toLowerCase().includes(search) ||
        j.company?.toLowerCase().includes(search) ||
        j.description?.toLowerCase().includes(search) ||
        j.location?.toLowerCase().includes(search)
      );
    }

    if (category !== 'All') {
      filtered = filtered.filter((j: any) => 
        j.category?.toLowerCase().includes(category.toLowerCase()) ||
        j.title?.toLowerCase().includes(category.toLowerCase())
      );
    }

    if (location !== 'All') {
      filtered = filtered.filter((j: any) => 
        j.location?.toLowerCase().includes(location.toLowerCase())
      );
    }

    return NextResponse.json({
      success: true,
      jobs: filtered,
      totalCount: filtered.length
    });
  } catch (error: any) {
    console.error('Error fetching jobs API:', error);
    return NextResponse.json({ success: false, jobs: [], message: error.message }, { status: 500 });
  }
}
