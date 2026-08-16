import { NextResponse } from 'next/server';
import { sanityClient } from '@/lib/sanity.client';
import { sanityWriteClient } from '@/lib/sanity.write';

const TYPE_MAP: Record<string, string> = {
  leads: 'leadSubmission',
  stipends: 'stipendApplication',
  internships: 'internshipApplicant',
  jobs: 'jobLead',
};

// GET: Export CSV or Get Counts
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');
    const type = searchParams.get('type') || 'leads';

    // 1. Fetch Counts for all 4 collections
    if (action === 'counts') {
      const counts = await sanityClient.fetch(`{
        "leads": count(*[_type == "leadSubmission"]),
        "stipends": count(*[_type == "stipendApplication"]),
        "internships": count(*[_type == "internshipApplicant"]),
        "jobs": count(*[_type == "jobLead"])
      }`);

      return NextResponse.json({ success: true, counts });
    }

    // 2. Export CSV for specific collection
    if (type === 'stipends') {
      const items = await sanityClient.fetch(`*[_type == "stipendApplication"] | order(submittedAt desc)`);
      let csv = 'Student Name,Phone,Email,Qualification,Category,City,Status,Submitted At\n';
      items.forEach((item: any) => {
        csv += `"${item.studentName || ''}","${item.phone || ''}","${item.email || ''}","${item.qualification || ''}","${item.category || ''}","${item.city || ''}","${item.status || 'Pending'}","${item.submittedAt || ''}"\n`;
      });

      return new Response(csv, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': 'attachment; filename="stipend_applications.csv"',
        },
      });
    } else if (type === 'internships') {
      const items = await sanityClient.fetch(`*[_type == "internshipApplicant"] | order(submittedAt desc)`);
      let csv = 'Full Name,Phone,Email,Course / Domain,Qualification,Preferred Batch,Status,Notes,Submitted At\n';
      items.forEach((item: any) => {
        csv += `"${item.fullName || ''}","${item.phone || ''}","${item.email || ''}","${item.course || ''}","${item.qualification || ''}","${item.preferredBatch || ''}","${item.status || 'Pending'}","${(item.notes || '').replace(/"/g, '""')}","${item.submittedAt || ''}"\n`;
      });

      return new Response(csv, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': 'attachment; filename="internship_applications.csv"',
        },
      });
    } else if (type === 'jobs') {
      const items = await sanityClient.fetch(`*[_type == "jobLead"] | order(appliedAt desc)`);
      let csv = 'Full Name,Email,Phone,Job Title,Company,Qualification,Experience,City,Portal Link,Status,Admin Notes,Applied At\n';
      items.forEach((item: any) => {
        csv += `"${item.fullName || ''}","${item.email || ''}","${item.phone || ''}","${item.jobTitle || ''}","${item.company || ''}","${item.qualification || ''}","${item.experience || ''}","${item.city || ''}","${item.appliedJobUrl || ''}","${item.status || 'New'}","${(item.adminNotes || '').replace(/"/g, '""')}","${item.appliedAt || ''}"\n`;
      });

      return new Response(csv, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': 'attachment; filename="job_portal_applications.csv"',
        },
      });
    } else {
      // Default: Visitor General Leads
      const items = await sanityClient.fetch(`*[_type == "leadSubmission"] | order(submittedAt desc)`);
      let csv = 'Full Name,Email,Phone,Course,Status,Message,Submitted At\n';
      items.forEach((item: any) => {
        csv += `"${item.fullName || ''}","${item.email || ''}","${item.phone || ''}","${item.course || ''}","${item.status || 'New'}","${(item.message || '').replace(/"/g, '""')}","${item.submittedAt || ''}"\n`;
      });

      return new Response(csv, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': 'attachment; filename="visitor_leads.csv"',
        },
      });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE: Safely purge all submissions for a selected collection
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');

    if (!type || !TYPE_MAP[type]) {
      return NextResponse.json(
        { success: false, message: 'Invalid or missing submission type parameter.' },
        { status: 400 }
      );
    }

    const schemaType = TYPE_MAP[type];

    // Fetch all document IDs of that type and batch delete
    const docIds = await sanityClient.fetch(`*[_type == $schemaType]._id`, { schemaType });

    if (!docIds || docIds.length === 0) {
      return NextResponse.json({
        success: true,
        deletedCount: 0,
        message: 'No submissions found to delete.',
      });
    }

    const transaction = sanityWriteClient.transaction();
    docIds.forEach((id: string) => {
      transaction.delete(id);
    });

    await transaction.commit();

    return NextResponse.json({
      success: true,
      deletedCount: docIds.length,
      message: `Successfully deleted ${docIds.length} submission(s).`,
    });
  } catch (error: any) {
    console.error('Lead Deletion Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete submissions.' },
      { status: 500 }
    );
  }
}
