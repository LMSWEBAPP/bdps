import { NextResponse } from 'next/server';
import { getSanityTestimonials } from '@/lib/sanity.client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const DEFAULT_TESTIMONIALS = [
  {
    name: 'Amit Patel',
    courseName: 'Core Java & Software Programming',
    quote: 'The structural focus on writing clean programs and solving coding problems prepared me for actual interviews. The instructors guided me through every lab assignment.',
    role: 'Junior Java Developer',
    company: 'Tech Services',
    rating: 5,
  },
  {
    name: 'Neha Kulkarni',
    courseName: 'PGDCA Diploma',
    quote: 'The PGDCA program is extremely thorough. It covers office automation, spreadsheets, and databases. I gained confidence and transitioned into systems operations.',
    role: 'Systems Operator',
    company: 'Enterprise Ltd',
    rating: 5,
  },
  {
    name: 'Vikram Sen',
    courseName: 'Tally Prime & Financial Accounting',
    quote: 'BDPS teaches Tally with real financial books and GST calculations. The lab assistants helped me clear all my accounting doubts immediately.',
    role: 'Junior Accountant',
    company: 'Finance Corp',
    rating: 5,
  },
];

export async function GET() {
  try {
    const testimonials = await getSanityTestimonials();
    return NextResponse.json({
      success: true,
      testimonials: (testimonials && testimonials.length > 0) ? testimonials : DEFAULT_TESTIMONIALS,
    });
  } catch (error) {
    return NextResponse.json({
      success: true,
      testimonials: DEFAULT_TESTIMONIALS,
      warning: 'Fallback used due to fetch error',
    });
  }
}
