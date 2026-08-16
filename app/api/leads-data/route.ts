import { NextResponse } from 'next/server';
import { sanityClient } from '@/lib/sanity.client';
import { sanityWriteClient } from '@/lib/sanity.write';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const data = await sanityClient.fetch(`{
      "leads": *[_type == "leadSubmission"] | order(submittedAt desc) {
        _id,
        fullName,
        email,
        phone,
        course,
        message,
        status,
        submittedAt
      },
      "stipends": *[_type == "stipendApplication"] | order(submittedAt desc) {
        _id,
        "fullName": studentName,
        phone,
        email,
        qualification,
        category,
        city,
        status,
        submittedAt
      },
      "internships": *[_type == "internshipApplicant"] | order(submittedAt desc) {
        _id,
        fullName,
        phone,
        email,
        course,
        qualification,
        preferredBatch,
        notes,
        status,
        submittedAt
      },
      "jobs": *[_type == "jobLead"] | order(appliedAt desc) {
        _id,
        fullName,
        email,
        phone,
        jobTitle,
        company,
        qualification,
        experience,
        city,
        appliedJobUrl,
        status,
        adminNotes,
        "submittedAt": appliedAt
      }
    }`);

    return NextResponse.json({
      success: true,
      leads: data.leads || [],
      stipends: data.stipends || [],
      internships: data.internships || [],
      jobs: data.jobs || [],
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Single record deletion
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Document ID is required' }, { status: 400 });
    }

    await sanityWriteClient.delete(id);

    return NextResponse.json({ success: true, message: 'Record deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
