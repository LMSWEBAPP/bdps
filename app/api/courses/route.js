import { NextResponse } from 'next/server';
import { getSanityCourses } from '@/lib/sanity.client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const sanityCourses = await getSanityCourses();
    return NextResponse.json(
      { success: true, courses: sanityCourses },
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
