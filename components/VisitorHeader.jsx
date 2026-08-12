'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Search, ChevronDown, Award, Phone, Mail, Clock, MapPin, Menu, X, ShieldCheck, Briefcase, ArrowRight, BookOpen
} from 'lucide-react';
import StipendRegistrationModal from './StipendRegistrationModal';
import InternshipModal from './forms/InternshipModal';

export default function VisitorHeader() {
  const pathname = usePathname();
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [stipendModalOpen, setStipendModalOpen] = useState(false);
  const [internshipModalOpen, setInternshipModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileCoursesExpanded, setMobileCoursesExpanded] = useState(false);
  const [announcementClosed, setAnnouncementClosed] = useState(false);

  // Dynamic Site Settings & Live Courses strictly from Sanity CMS
  const [siteSettings, setSiteSettings] = useState(null);
  const [liveCourses, setLiveCourses] = useState([]);

  useEffect(() => {
    // Check local session cache for instant zero-flash rendering
    try {
      if (sessionStorage.getItem('bdps_announcement_closed') === 'true') {
        setAnnouncementClosed(true);
      }
      const cachedActive = sessionStorage.getItem('bdps_stipend_active');
      if (cachedActive !== null) {
        setSiteSettings({
          stipendRegistrationActive: cachedActive === 'true',
          stipendNoticeText: sessionStorage.getItem('bdps_stipend_notice') || 'Stipend registrations for the current batch are now closed.'
        });
      }
    } catch (e) {}

    // Fresh fetch site settings
    fetch('/api/site-settings', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.settings) {
          setSiteSettings(data.settings);
          try {
            sessionStorage.setItem('bdps_stipend_active', String(data.settings.stipendRegistrationActive !== false));
            if (data.settings.stipendNoticeText) {
              sessionStorage.setItem('bdps_stipend_notice', data.settings.stipendNoticeText);
            }
          } catch (e) {}
        }
      })
      .catch(err => console.error('Error fetching site settings:', err));

    // Fetch live courses for mega dropdown
    fetch('/api/courses', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.courses) && data.courses.length > 0) {
          setLiveCourses(data.courses);
        }
      })
      .catch(() => {});
  }, []);

  const handleCloseAnnouncement = () => {
    setAnnouncementClosed(true);
    try {
      sessionStorage.setItem('bdps_announcement_closed', 'true');
    } catch (e) {}
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinks = [
    { title: 'Home', href: '/' },
    { 
      title: 'All Courses', 
      href: '/courses',
      isMegaMenu: true 
    },
    { title: 'Jobs', href: '/jobs' },
    { title: 'Verify Certificate', href: '/verify-certificate' },
    { title: 'About Us', href: '/about' },
    { 
      title: 'Contact Us', 
      href: '/contact',
      dropdown: [
        { label: 'Student Inquiry', href: '/contact?type=student' },
        { label: 'Corporate Collaboration', href: '/contact?type=collaboration' }
      ]
    }
  ];

  const isStipendActive = siteSettings !== null && siteSettings.stipendRegistrationActive !== false;
  const isInternshipActive = siteSettings !== null && siteSettings.internshipActive !== false;

  return (
    <>
      {/* Optional Top Announcement Banner with Close Button */}
      {siteSettings?.announcementBanner && !announcementClosed && (
        <div className="visitor-announcement-bar">
          <span className="announcement-text">{siteSettings.announcementBanner}</span>
          <button
            type="button"
            onClick={handleCloseAnnouncement}
            className="announcement-close-btn"
            aria-label="Close Announcement Banner"
            title="Dismiss Announcement"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Top Contact Bar */}
      <div className="visitor-top-bar">
        <div className="top-bar-contact">
          <a href={`tel:${siteSettings?.contactPhone?.replace(/\s+/g, '') || '+918500108016'}`} className="top-bar-link">
            <Phone size={13} /> {siteSettings?.contactPhone || '+91 85001 08016'}
          </a>
          <a href={`mailto:${siteSettings?.contactEmail || 'bdpskkd@gmail.com'}`} className="top-bar-link">
            <Mail size={13} /> {siteSettings?.contactEmail || 'bdpskkd@gmail.com'}
          </a>
        </div>
        <div className="top-bar-links-group">
          <Link href="/about" className="top-bar-sublink">
            {siteSettings?.headerTopBarLegacyText || 'Our Legacy (Since 2006)'}
          </Link>
          <span className="top-bar-divider">|</span>
          <Link href="/contact?type=collaboration" className="top-bar-sublink">
            {siteSettings?.headerTopBarAlliancesText || 'Placement Alliances'}
          </Link>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header className="visitor-navbar">
        <div className="navbar-container">
          {/* Logo */}
          <Link href="/" className="navbar-logo">
            <div className="logo-badge">{siteSettings?.headerLogoBadge || 'BDPS'}</div>
            <div className="logo-title-group">
              <span className="logo-title">{siteSettings?.headerBrandTitle || 'BDPS Computer Education'}</span>
              <span className="logo-subtitle">{siteSettings?.headerBrandSubtitle || 'COMPUTER TRAINING INSTITUTE'}</span>
            </div>
          </Link>

          {/* Quick Search */}
          <form onSubmit={handleSearch} className="header-search-form">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn" aria-label="Submit Search">
              <Search size={16} />
            </button>
          </form>

          {/* Desktop Navigation Links */}
          <nav className="desktop-nav">
            {navLinks.map((link, idx) => (
              <div
                key={idx}
                className="nav-item-wrapper"
                onMouseEnter={() => (link.dropdown || link.isMegaMenu) && setActiveDropdown(idx)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={link.href}
                  className={`nav-item-link ${pathname === link.href ? 'active' : ''}`}
                >
                  {link.title}
                  {(link.dropdown || link.isMegaMenu) && <ChevronDown size={14} />}
                </Link>

                {/* Regular Dropdown */}
                {link.dropdown && activeDropdown === idx && (
                  <div className="nav-dropdown-menu">
                    {link.dropdown.map((item, subIdx) => (
                      <Link
                        key={subIdx}
                        href={item.href}
                        className="nav-dropdown-item"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}

                {/* Mega Main Menu for All Courses */}
                {link.isMegaMenu && activeDropdown === idx && (
                  <div className="nav-mega-menu">
                    <div className="mega-menu-header">
                      <span className="mega-menu-header-title">Our Flagship IT Programs</span>
                      <span className="mega-menu-header-badge">{liveCourses.length} Courses Available</span>
                    </div>

                    <div className="mega-menu-grid">
                      {liveCourses.map((c, cIdx) => (
                        <Link
                          key={cIdx}
                          href={`/courses/${c.id || c._id}`}
                          className="mega-menu-course-item"
                          title={c.title}
                        >
                          <span className="mega-course-bullet">›</span>
                          <span className="mega-course-title">{c.title}</span>
                        </Link>
                      ))}
                    </div>

                    <div className="mega-menu-footer">
                      <span className="mega-menu-footer-hint">
                        💡 100% Practical Computer Labs & Placement Assistance
                      </span>
                      <Link href="/courses" className="mega-menu-footer-link">
                        <span>Explore All Programs</span> <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ))}

            <div className="header-cta-group">
              <button
                onClick={() => setInternshipModalOpen(true)}
                className={`btn-stipend btn-internship-nav ${!isInternshipActive ? 'btn-stipend-disabled' : ''}`}
                title="Apply for Internship"
              >
                <Briefcase size={14} className="icon-orange-accent" />
                <span className="cta-label-text">Internship</span>
                {!isInternshipActive && <span className="btn-stipend-tag tag-closed">CLOSED</span>}
              </button>

              {isStipendActive && (
                <button
                  onClick={() => setStipendModalOpen(true)}
                  className="btn-stipend stipend-pulse-highlight btn-stipend-nav"
                  title="Stipend Registration"
                >
                  <Award size={14} className="stipend-icon" />
                  <span className="cta-label-text">Stipend</span>
                  <span className="btn-stipend-tag tag-open">OPEN</span>
                </button>
              )}
              <a
                href={process.env.NEXT_PUBLIC_FRAPPE_URL ? `${process.env.NEXT_PUBLIC_FRAPPE_URL}/login` : 'http://localhost:3000/login'}
                className="btn-login"
                title="Student Login Portal"
              >
                Student Login
              </a>
            </div>
          </nav>

          {/* Mobile Toggle Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="mobile-toggle-btn"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {menuOpen && (
          <div className="mobile-nav-drawer">
            {navLinks.map((link, idx) => (
              <div key={idx} className="mobile-nav-group">
                {link.isMegaMenu ? (
                  <>
                    <div 
                      onClick={() => setMobileCoursesExpanded(!mobileCoursesExpanded)}
                      className="mobile-nav-link"
                      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                    >
                      <span>{link.title}</span>
                      <ChevronDown 
                        size={16} 
                        style={{ 
                          transform: mobileCoursesExpanded ? 'rotate(180deg)' : 'none', 
                          transition: 'transform 0.2s' 
                        }} 
                      />
                    </div>
                    {mobileCoursesExpanded && (
                      <div className="mobile-nav-subgroup">
                        <Link
                          href="/courses"
                          onClick={() => setMenuOpen(false)}
                          className="mobile-nav-sublink"
                          style={{ fontWeight: '700', color: 'var(--brand-orange)' }}
                        >
                          📁 All Courses Catalog & Syllabus →
                        </Link>
                        {liveCourses.map((c, cIdx) => (
                          <Link
                            key={cIdx}
                            href={`/courses/${c.id || c._id}`}
                            onClick={() => setMenuOpen(false)}
                            className="mobile-nav-sublink"
                          >
                            • {c.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="mobile-nav-link"
                    >
                      {link.title}
                    </Link>
                    {link.dropdown && (
                      <div className="mobile-nav-subgroup">
                        {link.dropdown.map((item, subIdx) => (
                          <Link
                            key={subIdx}
                            href={item.href}
                            onClick={() => setMenuOpen(false)}
                            className="mobile-nav-sublink"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}

            <div className="mobile-cta-wrapper">
              <form onSubmit={handleSearch} className="mobile-search-form">
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="mobile-search-input"
                />
                <button type="submit" className="mobile-search-submit">
                  <Search size={16} />
                </button>
              </form>
              <button
                onClick={() => { setMenuOpen(false); setInternshipModalOpen(true); }}
                className={`btn-stipend mobile-btn-stipend ${!isInternshipActive ? 'btn-stipend-disabled' : ''}`}
                style={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }}
              >
                <Briefcase size={16} style={{ color: '#FF7518' }} />
                <span>Apply for Internship</span>
                {!isInternshipActive && <span className="btn-stipend-tag tag-closed" style={{ marginLeft: '6px' }}>CLOSED</span>}
              </button>

              {isStipendActive && (
                <button
                  onClick={() => { setMenuOpen(false); setStipendModalOpen(true); }}
                  className="btn-stipend stipend-pulse-highlight mobile-btn-stipend"
                >
                  <Award size={16} className="stipend-icon" />
                  <span>Stipend Registration</span>
                  <span className="btn-stipend-tag tag-open">
                    OPEN
                  </span>
                </button>
              )}
              <a
                href={process.env.NEXT_PUBLIC_FRAPPE_URL ? `${process.env.NEXT_PUBLIC_FRAPPE_URL}/login` : 'http://localhost:3000/login'}
                onClick={() => setMenuOpen(false)}
                className="mobile-btn-login"
              >
                Student Login
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Stipend Registration Modal */}
      <StipendRegistrationModal
        isOpen={stipendModalOpen}
        onClose={() => setStipendModalOpen(false)}
        siteSettings={siteSettings}
      />

      {/* Internship Application Modal */}
      <InternshipModal
        isOpen={internshipModalOpen}
        onClose={() => setInternshipModalOpen(false)}
        siteSettings={siteSettings}
      />
    </>
  );
}
