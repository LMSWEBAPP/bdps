import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sanityClient } from '../../../lib/sanity.client';
import { sanityWriteClient } from '../../../lib/sanity.write';

const stipendSchema = z.object({
  studentName: z.string().min(2, 'Name is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  email: z.string().email('Invalid email address'),
  qualification: z.string().min(2, 'Qualification is required'),
  category: z.string().min(1, 'Category is required'),
  city: z.string().min(2, 'City is required'),
});

export async function POST(req: Request) {
  try {
    const settings = await sanityClient.fetch(`*[_type == "siteSettings"][0]{ stipendRegistrationActive, stipendNoticeText }`);
    if (settings && settings.stipendRegistrationActive === false) {
      return NextResponse.json({
        success: false,
        message: settings.stipendNoticeText || 'Stipend registrations are currently closed.',
      }, { status: 403 });
    }

    const body = await req.json();
    const validatedData = stipendSchema.parse(body);

    const doc = {
      _type: 'stipendApplication',
      studentName: validatedData.studentName,
      phone: validatedData.phone,
      email: validatedData.email,
      qualification: validatedData.qualification,
      category: validatedData.category,
      city: validatedData.city,
      status: 'Pending',
      submittedAt: new Date().toISOString(),
    };

    const createdDoc = await sanityWriteClient.create(doc);

    // VPS Forwarding (if configured when Frappe is deployed on VPS)
    const frappeUrl = process.env.NEXT_PUBLIC_FRAPPE_URL;
    if (frappeUrl) {
      try {
        await fetch(`${frappeUrl}/api/method/lms.api.create_stipend_application`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.INTERNAL_SERVICE_TOKEN || ''}`,
          },
          body: JSON.stringify({
            student_name: validatedData.studentName,
            email: validatedData.email,
            phone: validatedData.phone,
            qualification: validatedData.qualification,
            category: validatedData.category,
            city: validatedData.city,
          }),
        });
      } catch (err) {
        console.error('VPS Stipend Application Forwarding Warning:', err);
      }
    }

    return NextResponse.json({ success: true, id: createdDoc._id, message: 'Stipend application submitted successfully' });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: error.message || 'Server error' }, { status: 500 });
  }
}
