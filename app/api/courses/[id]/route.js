import { NextResponse } from 'next/server';
import { getSanityCourseById } from '@/lib/sanity.client';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const course = await getSanityCourseById(id);
    if (!course) {
      return NextResponse.json({ success: false, message: 'Course not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, course });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
