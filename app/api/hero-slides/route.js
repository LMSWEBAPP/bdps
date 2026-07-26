import { NextResponse } from 'next/server';
import { getSanityHeroSlides } from '@/lib/sanity.client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const slides = await getSanityHeroSlides();
    return NextResponse.json(
      { success: true, slides },
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
