import { NextResponse } from 'next/server';
import { sanityClient } from '@/lib/sanity.client';
import { sanityWriteClient } from '@/lib/sanity.write';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const query = `*[_type == "jobPosting" && (defined(adzunaId) || _id match "job_adzuna_*" || (defined(redirectUrl) && redirectUrl match "*adzuna*"))]._id`;
    const docsToDelete = await sanityClient.fetch(query, {}, { cache: 'no-store' });

    if (!Array.isArray(docsToDelete) || docsToDelete.length === 0) {
      return NextResponse.json({
        success: true,
        deletedCount: 0,
        message: 'No Adzuna job postings found in Sanity CMS. Everything is clean!'
      });
    }

    const tx = sanityWriteClient.transaction();
    for (const id of docsToDelete) {
      tx.delete(id);
    }

    await tx.commit();

    return NextResponse.json({
      success: true,
      deletedCount: docsToDelete.length,
      deletedIds: docsToDelete,
      message: `Successfully deleted ${docsToDelete.length} Adzuna jobs from Sanity CMS!`
    });
  } catch (error: any) {
    console.error('Error purging Adzuna jobs:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
