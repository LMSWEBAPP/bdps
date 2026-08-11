import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sanityWriteClient } from '../../../lib/sanity.write';

const internshipSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number'),
  course: z.string().min(2, 'Please select an internship course / domain'),
  qualification: z.string().min(1, 'Please select your educational qualification'),
  preferredBatch: z.string().optional(),
  notes: z.string().optional(),
  b_hp: z.string().optional(), // Honeypot field for bot protection
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = internshipSchema.parse(body);

    // Spam / Bot protection: Honeypot check
    if (validatedData.b_hp && validatedData.b_hp.trim() !== '') {
      // Silently discard bot submission with zero Sanity API usage
      return NextResponse.json({ success: true, message: 'Application submitted successfully' });
    }

    // Check if internship submissions are enabled in Sanity Site Settings
    const settings = await sanityWriteClient.fetch(
      `*[_type == "siteSettings" && !(_id in path("drafts.**"))][0]{ internshipActive, internshipNoticeText }`
    );

    if (settings && settings.internshipActive === false) {
      return NextResponse.json(
        {
          success: false,
          message: settings.internshipNoticeText || 'Internship applications are currently closed.'
        },
        { status: 400 }
      );
    }

    const cleanEmail = validatedData.email.trim().toLowerCase();
    const cleanPhone = validatedData.phone.trim().replace(/\D/g, '');

    // Duplicate check on Sanity CMS (1 fast read query before writing)
    const existing = await sanityWriteClient.fetch(
      `*[_type == "internshipApplicant" && (email == $email || phone == $phone)][0]._id`,
      { email: cleanEmail, phone: cleanPhone }
    );

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: 'An application with this email address or phone number has already been submitted.'
        },
        { status: 400 }
      );
    }

    const doc = {
      _type: 'internshipApplicant',
      fullName: validatedData.fullName.trim(),
      email: cleanEmail,
      phone: cleanPhone,
      course: validatedData.course.trim(),
      qualification: validatedData.qualification,
      preferredBatch: validatedData.preferredBatch || 'Morning (9 AM - 11 AM)',
      notes: validatedData.notes ? validatedData.notes.trim() : '',
      status: 'Pending',
      submittedAt: new Date().toISOString(),
    };

    const createdDoc = await sanityWriteClient.create(doc);

    return NextResponse.json({
      success: true,
      id: createdDoc._id,
      message: 'Internship application submitted successfully! Our team will get in touch with you.'
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0]?.message || 'Validation error';
      return NextResponse.json({ success: false, message: firstError, errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: error.message || 'Server error' }, { status: 500 });
  }
}
