'use client';

import { Award, GraduationCap, Users, CheckCircle2, ShieldCheck, Cpu, Briefcase, BookOpen } from 'lucide-react';
import Link from 'next/link';
import VisitorHeader from '@/components/VisitorHeader';
import VisitorFooter from '@/components/VisitorFooter';

export default function VisitorAboutPage() {
  const branding = {
    title: 'BDPS Computer Education',
    shortName: 'BDPS',
    tagline: 'Empowering Kakinada with professional computer applications and programming literacy since 2006.',
    establishedYear: 2006
  };

  const stats = [
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
  ];

  const beliefs = [
    {
      title: 'Practical Lab-First Learning',
      desc: 'We focus heavily on hands-on desktop configurations, spreadsheets, data structures, and capstone project modules rather than mere syntax memorisation.',
      icon: <GraduationCap size={22} className="icon-orange" />
    },
    {
      title: 'Industry Veteran Faculty',
      desc: 'Our senior mentors bring 10+ years of active technical training experience specialized in diplomas, web stack, database engines, and accounting systems.',
      icon: <Users size={22} className="icon-orange" />
    },
    {
      title: 'Dedicated Placement Support',
      desc: 'We assist with technical resume building, mock viva-voce presentation preparation, and coordinate direct job referrals with hiring companies.',
      icon: <Award size={22} className="icon-orange" />
    }
  ];

  return (
    <div className="visitor-theme">
      <VisitorHeader />

      {/* Hero Banner */}
      <section className="page-banner-header">
        <div className="page-banner-container">
          <div className="support-tag">
            <ShieldCheck size={14} /> Established 2006 • Kakinada HQ
          </div>
          <h1 className="page-banner-title">About {branding.shortName}</h1>
          <p className="page-banner-desc">
            Empowering tech aspirants with practical computing skills, industry certifications, and career launchpads.
          </p>
        </div>
      </section>

      {/* Main Section */}
      <main className="contact-container">
        {/* Legacy & History Section */}
        <section className="about-grid">
          <div>
            <div className="about-badge-header">
              <SparklesIcon /> 20+ Years of Academic Trust
            </div>
            <h2 className="about-heading">
              Over {new Date().getFullYear() - branding.establishedYear} Years of Software Training Excellence
            </h2>
            <p className="about-paragraph">
              {branding.title} ({branding.shortName}) has grown to become Kakinada's premier training hub for computer applications, financial accounting, and software programming. We have successfully trained and graduated over 12,000 students into software engineering, office administration, and commercial accounting roles.
            </p>
            <p className="about-paragraph">
              Through structured interactive study plans, direct mentor guidance, and 100% practical lab practice, we deliver a learning platform that bridges the gap between college curricula and industry job requirements.
            </p>

            <div className="about-highlights-list">
              <div className="about-highlight-item">
                <CheckCircle2 size={18} className="icon-orange" />
                <span>Government Recognized & Industry Certified Diplomas</span>
              </div>
              <div className="about-highlight-item">
                <CheckCircle2 size={18} className="icon-orange" />
                <span>24/7 Access to BDPS AI Tutor for Instant Doubts Resolution</span>
              </div>
              <div className="about-highlight-item">
                <CheckCircle2 size={18} className="icon-orange" />
                <span>100% Hands-on Desktop Lab Configurations for Every Student</span>
              </div>
            </div>
          </div>

          {/* Featured Trust Spotlight Box */}
          <div className="about-featured-card">
            <div className="ai-tutor-badge">
              <Award size={14} /> Premier Institute
            </div>
            <h3 className="bento-card-title-dark">Why Kakinada Trusts BDPS</h3>
            <p className="bento-card-desc-dark">
              From high school graduates to degree students and working professionals, our flexible morning, afternoon, and evening batches fit every schedule.
            </p>
            
            <div className="support-pillars-grid support-grid-none">
              <div className="support-pillar-card">
                <Cpu size={20} className="icon-orange" />
                <div>
                  <h5 className="card-heading-light">Modern Computer Labs</h5>
                  <p className="card-desc-light">High-speed workstations with latest software</p>
                </div>
              </div>

              <div className="support-pillar-card">
                <Briefcase size={20} className="icon-orange" />
                <div>
                  <h5 className="card-heading-light">Job Placement Desk</h5>
                  <p className="card-desc-light">Direct referrals to 800+ hiring partners</p>
                </div>
              </div>
            </div>

            <Link href="/courses" className="btn-explore">
              Explore Our Courses →
            </Link>
          </div>
        </section>

        {/* Full-Width 4 Stats Cards Grid */}
        <section className="about-stats-full-section">
          <div className="about-stats-grid-4">
            {stats.map((s, idx) => (
              <div key={idx} className="about-stat-card-rich">
                <div className="about-stat-number">{s.value}{s.suffix}</div>
                <div className="about-stat-title">{s.label}</div>
                <div className="about-stat-subdesc">{s.description}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Core Beliefs Section */}
        <section className="bento-section">
          <div className="section-header-center">
            <span className="section-subtitle-tag">OUR CORE BELIEFS</span>
            <h2 className="section-title">
              Why Students Choose <span className="section-title-accent">BDPS</span>
            </h2>
          </div>

          <div className="bento-grid">
            {beliefs.map((b, i) => (
              <div key={i} className="belief-card-clean">
                <div className="belief-icon-box">
                  {b.icon}
                </div>
                <h3 className="bento-card-title">{b.title}</h3>
                <p className="bento-card-desc">{b.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <VisitorFooter />
    </div>
  );
}

function SparklesIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
    </svg>
  );
}
