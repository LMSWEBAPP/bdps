import { NextResponse } from 'next/server';
import { getSanityHeroSlides } from '@/lib/sanity.client';

export const revalidate = 60;

export async function GET() {
  try {
    const slides = await getSanityHeroSlides();
    return NextResponse.json(
      { success: true, slides },
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
