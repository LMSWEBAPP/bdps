import { NextResponse } from 'next/server';
import { getSanityContactPage, getSanitySiteSettings } from '@/lib/sanity.client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const [contactData, siteSettings] = await Promise.all([
      getSanityContactPage(),
      getSanitySiteSettings(),
    ]);

    const defaultAddress = siteSettings?.address || 'Flat No. 1, Sai Prameela Apartment, B-Block, Backside Ulavacharu Restaurant, Nagamallithota Junction, Pithapuram Road, Kakinada - 533003';
    const defaultPhone = siteSettings?.contactPhone || '+91 85001 08016';
    const defaultEmail = siteSettings?.contactEmail || 'bdpskkd@gmail.com';

    const fallbackBranches = [
      {
        name: 'Kakinada Campus (Corporate HQ)',
        address: defaultAddress,
        phone: defaultPhone,
        email: defaultEmail,
        timings: 'Mon - Sat: 7:30 AM - 8:30 PM IST',
        description: 'Visit our primary campus in Kakinada to review lab setups, interact with faculty mentors, or request course counseling.',
        mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3815.7196022838426!2d82.25141071112674!3d16.988220084364417!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a3828414ca0cd97%3A0x88981e6992d9f2d1!2sNagamallithota%20Junction%2C%20Kakinada%2C%20Andhra%20Pradesh%20533003!5e0!3m2!1sen!2sin!4v1720000000000!5m2!1sen!2sin',
      },
    ];

    const fallbackCourses = [
      'General Counseling',
      'Software Development (Full Stack)',
      'Data Science & AI',
      'Tally Prime & GST',
      'PGDCA Diploma',
    ];

    const fallbackCollabTypes = [
      'Campus Placement / Talent Recruitment',
      'Corporate Employee Upskilling',
      'Lab & Capstone Project Sponsorship',
      'Guest Lecture & IEEE Workshops',
    ];

    const mergedData = {
      studentBannerTitle: contactData?.studentBannerTitle || 'Contact Our Advisors',
      studentBannerDesc: contactData?.studentBannerDesc || 'Get in touch to clear course doubts, check batch timings, or request custom syllabus modules.',
      collabBannerTitle: contactData?.collabBannerTitle || 'Corporate & Institutional Collaboration',
      collabBannerDesc: contactData?.collabBannerDesc || 'Partner with BDPS to recruit skilled software talent, execute corporate training bootcamps, or sponsor academic project labs.',
      branches: (contactData?.branches && contactData.branches.length > 0) ? contactData.branches : fallbackBranches,
      studentCourses: (contactData?.studentCourses && contactData.studentCourses.length > 0) ? contactData.studentCourses : fallbackCourses,
      collabTypes: (contactData?.collabTypes && contactData.collabTypes.length > 0) ? contactData.collabTypes : fallbackCollabTypes,
    };

    return NextResponse.json({
      success: true,
      data: mergedData,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
