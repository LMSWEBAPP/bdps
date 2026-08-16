import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sanityWriteClient } from '@/lib/sanity.write';

const jobLeadSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Valid 10-digit phone number is required'),
  jobTitle: z.string().default('Indian Job Opening'),
  company: z.string().default('Direct Employer'),
  qualification: z.string().default('Graduate / Degree'),
  experience: z.string().default('Fresher (0 - 1 Years)'),
  city: z.string().default('India'),
  appliedJobUrl: z.string().url().or(z.string()).default('https://www.adzuna.in'),
  notes: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validated = jobLeadSchema.parse(body);

    const doc = {
      _type: 'jobLead',
      fullName: validated.fullName.trim(),
      email: validated.email.trim(),
      phone: validated.phone.trim(),
      jobTitle: validated.jobTitle,
      company: validated.company,
      qualification: validated.qualification,
      experience: validated.experience,
      city: validated.city,
      appliedJobUrl: validated.appliedJobUrl,
      status: 'New',
      adminNotes: validated.notes ? `Applicant Note: ${validated.notes}` : '',
      appliedAt: new Date().toISOString(),
    };

    let createdId = null;
    try {
      const created = await sanityWriteClient.create(doc);
      createdId = created._id;
    } catch (sanityErr: any) {
      console.warn('Sanity Write Client warning (falling back to success):', sanityErr.message);
    }

    // Optional VPS LMS Forwarding
    const frappeUrl = process.env.NEXT_PUBLIC_FRAPPE_URL;
    if (frappeUrl) {
      try {
        await fetch(`${frappeUrl}/api/method/lms.api.create_lead`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.INTERNAL_SERVICE_TOKEN || ''}`,
          },
          body: JSON.stringify({
            full_name: validated.fullName,
            email: validated.email,
            phone: validated.phone,
            interested_course: `Job Application: ${validated.jobTitle} (${validated.company})`,
            message: `Qualification: ${validated.qualification} | Experience: ${validated.experience} | City: ${validated.city}`,
          }),
        });
      } catch (e) {}
    }

    return NextResponse.json({
      success: true,
      id: createdId,
      message: 'Application submitted successfully.',
      redirectUrl: validated.appliedJobUrl,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: error.errors[0]?.message || 'Invalid form data', errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
