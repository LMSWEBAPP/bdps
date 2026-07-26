import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sanityWriteClient } from '../../../lib/sanity.write';

const leadSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Valid phone number is required'),
  course: z.string().optional(),
  message: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = leadSchema.parse(body);

    const doc = {
      _type: 'leadSubmission',
      fullName: validatedData.fullName,
      email: validatedData.email,
      phone: validatedData.phone,
      course: validatedData.course || 'General Inquiry',
      message: validatedData.message || '',
      status: 'New',
      submittedAt: new Date().toISOString(),
    };

    const createdDoc = await sanityWriteClient.create(doc);

    // Optional Phase 2 VPS Forwarding (if configured)
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
            full_name: validatedData.fullName,
            email: validatedData.email,
            phone: validatedData.phone,
            interested_course: validatedData.course,
            message: validatedData.message,
          }),
        });
      } catch (err) {
        console.error('VPS Lead Forwarding Warning:', err);
      }
    }

    return NextResponse.json({ success: true, id: createdDoc._id, message: 'Lead submitted successfully' });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: error.message || 'Server error' }, { status: 500 });
  }
}
