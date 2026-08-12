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
          announcementBanner: '🚀 New Batches Starting This Monday! Limited Seats in Full Stack & AI Tracks.',
          headerBrandTitle: 'BDPS Computer Education',
          headerBrandSubtitle: 'COMPUTER TRAINING INSTITUTE',
          headerLogoBadge: 'BDPS',
          headerTopBarLegacyText: 'Our Legacy (Since 2006)',
          headerTopBarAlliancesText: 'Placement Alliances',
          stipendRegistrationActive: true,
          stipendNoticeText: 'Stipend registrations for the current batch are now closed. Please check back for upcoming cohort announcements.',
          internshipActive: true,
          internshipNoticeText: 'Internship applications for the current batch are currently closed. Please check back for upcoming cohort announcements.',
          internshipCourses: ['Python Full Stack', 'Core Java & Spring Boot', 'Web Development (MERN)', 'Tally Prime & GST Accounting'],
          contactEmail: 'bdpskkd@gmail.com',
          contactPhone: '+91 85001 08016',
          whatsappNumber: '+91 85001 08016',
          address: 'Flat No. 1, Sai Prameela Apartment, B-Block, Backside Ulavacharu Restaurant, Nagamallithota Junction, Pithapuram Road, Kakinada - 533003',
          facebook: 'https://facebook.com/bdpscomputers',
          instagram: 'https://instagram.com/bdpscomputers',
          linkedin: 'https://linkedin.com/company/bdps',
          youtube: 'https://youtube.com/@bdpscomputers',
          twitter: 'https://twitter.com/bdpscomputers',
          footerTagline: 'Learn Today | 🚀 Lead Tomorrow | 🌍 Transform Tomorrow',
          footerShowCsr: true,
          footerCsrText: '🤝 CSR Initiatives in Collaboration with Embracing Humanity Foundation (EHF)',
          footerPopularCourses: [
            { label: 'PGDCA Diploma', href: '/courses' },
            { label: 'Core Java Certification', href: '/courses' },
            { label: 'Tally Prime Accounting', href: '/courses' },
            { label: 'C Language & Web Dev', href: '/courses' },
            { label: 'Academic Projects Lab', href: '/courses' },
          ],
          footerQuickLinks: [
            { label: 'Apply for Internship', href: '/courses', isModal: true },
            { label: 'Certificate Verification', href: '/verify-certificate', isModal: false },
            { label: 'Job Openings & Placements', href: '/jobs', isModal: false },
            { label: 'Upcoming Batches', href: '/courses', isModal: false },
            { label: 'About BDPS', href: '/about', isModal: false },
            { label: 'Services Offered', href: '/courses', isModal: false },
            { label: 'Student Reviews', href: '/', isModal: false },
            { label: 'Contact Us', href: '/contact', isModal: false },
          ],
          footerAccreditationText: 'ISO 9001:2015 Accredited',
          footerCopyrightText: 'All Rights Reserved.'
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
