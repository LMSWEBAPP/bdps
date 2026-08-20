import { NextResponse } from 'next/server';
import { getSanityCourses } from '@/lib/sanity.client';

export const revalidate = 60;

export async function GET() {
  try {
    const sanityCourses = await getSanityCourses();
    return NextResponse.json(
      { success: true, courses: sanityCourses },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
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
