import { NextResponse } from 'next/server';
import { getSanityAboutPage } from '@/lib/sanity.client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const DEFAULT_ABOUT_PAGE = {
  bannerBadge: 'Established 2006 • Kakinada HQ',
  bannerTitle: 'About BDPS',
  bannerDesc: 'Empowering tech aspirants with practical computing skills, industry certifications, and career launchpads.',
  legacyBadge: '20+ Years of Academic Trust',
  legacyHeading: 'Over 20 Years of Software Training Excellence',
  storyParagraphs: [
    'BDPS Computer Education (BDPS) has grown to become Kakinada\'s premier training hub for computer applications, financial accounting, and software programming. We have successfully trained and graduated over 12,000 students into software engineering, office administration, and commercial accounting roles.',
    'Through structured interactive study plans, direct mentor guidance, and 100% practical lab practice, we deliver a learning platform that bridges the gap between college curricula and industry job requirements.',
  ],
  highlightsList: [
    'Government Recognized & Industry Certified Diplomas',
    '24/7 Access to BDPS AI Tutor for Instant Doubts Resolution',
    '100% Hands-on Desktop Lab Configurations for Every Student',
  ],
  spotlightBadge: 'Premier Institute',
  spotlightTitle: 'Why Kakinada Trusts BDPS',
  spotlightDesc: 'From high school graduates to degree students and working professionals, our flexible morning, afternoon, and evening batches fit every schedule.',
  spotlightPillars: [
    {
      icon: 'Cpu',
      title: 'Modern Computer Labs',
      desc: 'High-speed workstations with latest software',
    },
    {
      icon: 'Briefcase',
      title: 'Job Placement Desk',
      desc: 'Direct referrals to 800+ hiring partners',
    },
  ],
  stats: [
    { 
      label: 'Years of Legacy', 
      value: '20', 
      suffix: '+', 
      description: 'Years of continuous IT education & academic trust in Kakinada.' 
    },
    { 
      label: 'Graduated Students', 
      value: '12,000', 
      suffix: '+', 
      description: 'Students trained in desktop software, diplomas & coding.' 
    },
    { 
      label: 'Hiring Partners', 
      value: '800', 
      suffix: '+', 
      description: 'Registered IT MNCs, banks & local enterprise partners.' 
    },
    { 
      label: 'Placement Success', 
      value: '94', 
      suffix: '%', 
      description: 'Career transition & job referral success rate.' 
    }
  ],
  beliefsSubtitle: 'OUR CORE BELIEFS',
  beliefsTitle: 'Why Students Choose BDPS',
  beliefs: [
    {
      title: 'Practical Lab-First Learning',
      desc: 'We focus heavily on hands-on desktop configurations, spreadsheets, data structures, and capstone project modules rather than mere syntax memorisation.',
      icon: 'GraduationCap',
    },
    {
      title: 'Industry Veteran Faculty',
      desc: 'Our senior mentors bring 10+ years of active technical training experience specialized in diplomas, web stack, database engines, and accounting systems.',
      icon: 'Users',
    },
    {
      title: 'Dedicated Placement Support',
      desc: 'We assist with technical resume building, mock viva-voce presentation preparation, and coordinate direct job referrals with hiring companies.',
      icon: 'Award',
    },
  ],
};

export async function GET() {
  try {
    const data = await getSanityAboutPage();
    return NextResponse.json({
      success: true,
      data: data || DEFAULT_ABOUT_PAGE,
    });
  } catch (error) {
    return NextResponse.json({
      success: true,
      data: DEFAULT_ABOUT_PAGE,
      warning: 'Fallback used due to fetch error',
    });
  }
}
