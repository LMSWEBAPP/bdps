import { NextResponse } from 'next/server';
import { getSanitySiteSettings } from '@/lib/sanity.client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const settings = await getSanitySiteSettings();
    return NextResponse.json(
      {
        success: true,
        settings: settings || {
          stipendRegistrationActive: true,
          stipendNoticeText: 'Stipend registrations for the current batch are now closed. Please check back for upcoming cohort announcements.',
          internshipActive: true,
          internshipNoticeText: 'Internship applications for the current batch are currently closed. Please check back for upcoming cohort announcements.',
          internshipCourses: [],
          contactEmail: 'bdpskkd@gmail.com',
          contactPhone: '+91 85001 08016',
          whatsappNumber: '+91 85001 08016',
          address: 'Flat No. 1, Sai Prameela Apartment, B-Block, Backside Ulavacharu Restaurant, Nagamallithota Junction, Pithapuram Road, Kakinada - 533003',
          facebook: 'https://facebook.com',
          instagram: 'https://instagram.com',
          linkedin: 'https://linkedin.com',
          youtube: 'https://youtube.com',
          twitter: 'https://twitter.com'
        }
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
