'use client';

import { useState, useEffect } from 'react';
import { Award, ShieldCheck, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import VisitorHeader from '@/components/VisitorHeader';
import VisitorFooter from '@/components/VisitorFooter';
import DynamicIcon from '@/components/DynamicIcon';
import { DEFAULT_ABOUT_PAGE } from '@/app/api/about-page/route';

export default function VisitorAboutPage() {
  const [pageData, setPageData] = useState(DEFAULT_ABOUT_PAGE);

  useEffect(() => {
    fetch('/api/about-page', { cache: 'no-store' })
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setPageData(res.data);
        }
      })
      .catch(() => {});
  }, []);

  const stats = (pageData.stats && pageData.stats.length > 0) ? pageData.stats : DEFAULT_ABOUT_PAGE.stats;
  const beliefs = (pageData.beliefs && pageData.beliefs.length > 0) ? pageData.beliefs : DEFAULT_ABOUT_PAGE.beliefs;
  const storyParagraphs = (pageData.storyParagraphs && pageData.storyParagraphs.length > 0) ? pageData.storyParagraphs : DEFAULT_ABOUT_PAGE.storyParagraphs;
  const highlights = (pageData.highlightsList && pageData.highlightsList.length > 0) ? pageData.highlightsList : DEFAULT_ABOUT_PAGE.highlightsList;
  const spotlightPillars = (pageData.spotlightPillars && pageData.spotlightPillars.length > 0) ? pageData.spotlightPillars : DEFAULT_ABOUT_PAGE.spotlightPillars;

  return (
    <div className="visitor-theme">
      <VisitorHeader />

      {/* Hero Banner */}
      <section className="page-banner-header">
        <div className="page-banner-container">
          <div className="support-tag">
            <ShieldCheck size={14} /> {pageData.bannerBadge || 'Established 2006 • Kakinada HQ'}
          </div>
          <h1 className="page-banner-title">{pageData.bannerTitle || 'About BDPS'}</h1>
          <p className="page-banner-desc">
            {pageData.bannerDesc || 'Empowering tech aspirants with practical computing skills, industry certifications, and career launchpads.'}
          </p>
        </div>
      </section>

      {/* Main Section */}
      <main className="contact-container">
        {/* Legacy & History Section */}
        <section className="about-grid">
          <div>
            <div className="about-badge-header">
              <SparklesIcon /> {pageData.legacyBadge || '20+ Years of Academic Trust'}
            </div>
            <h2 className="about-heading">
              {pageData.legacyHeading || 'Over 20 Years of Software Training Excellence'}
            </h2>

            {storyParagraphs.map((para, pIdx) => (
              <p key={pIdx} className="about-paragraph">
                {para}
              </p>
            ))}

            <div className="about-highlights-list">
              {highlights.map((item, hIdx) => (
                <div key={hIdx} className="about-highlight-item">
                  <CheckCircle2 size={18} className="icon-orange" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Trust Spotlight Box */}
          <div className="about-featured-card">
            <div className="ai-tutor-badge">
              <Award size={14} /> {pageData.spotlightBadge || 'Premier Institute'}
            </div>
            <h3 className="bento-card-title-dark">{pageData.spotlightTitle || 'Why Kakinada Trusts BDPS'}</h3>
            <p className="bento-card-desc-dark">
              {pageData.spotlightDesc || 'From high school graduates to degree students and working professionals, our flexible morning, afternoon, and evening batches fit every schedule.'}
            </p>
            
            <div className="support-pillars-grid support-grid-none">
              {spotlightPillars.map((p, sIdx) => (
                <div key={sIdx} className="support-pillar-card">
                  <DynamicIcon name={p.icon || 'Cpu'} size={20} className="icon-orange" />
                  <div>
                    <h5 className="card-heading-light">{p.title}</h5>
                    <p className="card-desc-light">{p.desc}</p>
                  </div>
                </div>
              ))}
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
                <div className="about-stat-number">{s.value}{s.suffix || '+'}</div>
                <div className="about-stat-title">{s.label}</div>
                <div className="about-stat-subdesc">{s.description}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Core Beliefs Section */}
        <section className="bento-section">
          <div className="section-header-center">
            <span className="section-subtitle-tag">{pageData.beliefsSubtitle || 'OUR CORE BELIEFS'}</span>
            <h2 className="section-title">
              {pageData.beliefsTitle ? (
                <span>{pageData.beliefsTitle}</span>
              ) : (
                <>Why Students Choose <span className="section-title-accent">BDPS</span></>
              )}
            </h2>
          </div>

          <div className="bento-grid">
            {beliefs.map((b, i) => (
              <div key={i} className="belief-card-clean">
                <div className="belief-icon-box">
                  <DynamicIcon name={b.icon || 'GraduationCap'} size={22} className="icon-orange" />
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
