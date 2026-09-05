import { NextResponse } from 'next/server';
import { sanityClient } from '@/lib/sanity.client';
import { sanityWriteClient } from '@/lib/sanity.write';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.toLowerCase() || '';
    const category = searchParams.get('category') || 'All';
    const location = searchParams.get('location') || 'All';

    // One-time automatic purge of any old Adzuna job documents from Sanity CMS
    try {
      const adzunaJobIds = await sanityClient.fetch(
        `*[_type == "jobPosting" && (defined(adzunaId) || _id match "job_adzuna_*" || (defined(redirectUrl) && redirectUrl match "*adzuna.in*"))]._id`
      );

      if (Array.isArray(adzunaJobIds) && adzunaJobIds.length > 0 && process.env.SANITY_WRITE_TOKEN) {
        const tx = sanityWriteClient.transaction();
        for (const id of adzunaJobIds) {
          tx.delete(id);
        }
        await tx.commit();
        console.log(`[Auto-Purge] Deleted ${adzunaJobIds.length} leftover Adzuna jobs from Sanity CMS.`);
      }
    } catch (purgeErr) {
      console.warn('Adzuna background purge notice:', purgeErr);
    }

    // Strictly fetch ONLY custom, manually-posted admin jobs from Sanity CMS
    const query = `*[_type == "jobPosting" && !defined(adzunaId) && !(_id match "job_adzuna_*") && (!defined(redirectUrl) || !(redirectUrl match "*adzuna.in*"))] | order(postedAt desc) [0...100] {
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

    // Apply in-memory search and filter criteria
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
