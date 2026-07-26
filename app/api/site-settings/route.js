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
          stipendNoticeText: 'Stipend registrations for the current batch are now closed. Please check back for upcoming cohort announcements.'
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
