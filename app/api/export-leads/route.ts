import { NextResponse } from 'next/server';
import { sanityClient } from '../../../lib/sanity.client';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'leads';

    if (type === 'stipends') {
      const items = await sanityClient.fetch(`*[_type == "stipendApplication"] | order(submittedAt desc)`);
      let csv = 'Student Name,Phone,Email,Qualification,Category,City,Status,Submitted At\n';
      items.forEach((item: any) => {
        csv += `"${item.studentName || ''}","${item.phone || ''}","${item.email || ''}","${item.qualification || ''}","${item.category || ''}","${item.city || ''}","${item.status || 'Pending'}","${item.submittedAt || ''}"\n`;
      });

      return new Response(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="stipend_applications.csv"',
        },
      });
    } else {
      const items = await sanityClient.fetch(`*[_type == "leadSubmission"] | order(submittedAt desc)`);
      let csv = 'Full Name,Email,Phone,Course,Status,Message,Submitted At\n';
      items.forEach((item: any) => {
        csv += `"${item.fullName || ''}","${item.email || ''}","${item.phone || ''}","${item.course || ''}","${item.status || 'New'}","${(item.message || '').replace(/"/g, '""')}","${item.submittedAt || ''}"\n`;
      });

      return new Response(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="visitor_leads.csv"',
        },
      });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
