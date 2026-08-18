'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Search, ChevronDown, Award, Phone, Mail, Clock, MapPin, Menu, X, ShieldCheck, Briefcase, ArrowRight, BookOpen, Sparkles, Home, Info, LogIn
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
        { label: 'Corporate Collaboration', href: '/contact?type=collaboration' },
        { label: 'IT Solutions & Services', href: '/contact?type=it-solutions' }
      ]
    }
  ];

  const isStipendActive = siteSettings !== null && siteSettings.stipendRegistrationActive !== false;
  const isInternshipActive = siteSettings !== null && siteSettings.internshipActive !== false;

  return (
    <>
      <header className="visitor-header-sticky-wrapper">
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
        <div className="visitor-navbar">
        <div className="navbar-container">
          {/* 1. Left: Brand Logo */}
          <Link href="/" className="navbar-logo">
            {siteSettings?.headerLogo ? (
              <img 
                src={siteSettings.headerLogo} 
                alt={siteSettings?.headerBrandTitle || 'BDPS Computer Education & IT Solutions'} 
                className="navbar-logo-img"
              />
            ) : (
              <>
                <div className="logo-badge">{siteSettings?.headerLogoBadge || 'BDPS'}</div>
                <div className="logo-title-group">
                  <span className="logo-title">{siteSettings?.headerBrandTitle || 'BDPS Computer Education'}</span>
                  <span className="logo-subtitle">{siteSettings?.headerBrandSubtitle || 'COMPUTER TRAINING INSTITUTE'}</span>
                </div>
              </>
            )}
          </Link>

          {/* 2. Right: Menu Links + Action Buttons Together */}
          <div className="navbar-right-cluster">
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
                    <span>{link.title}</span>
                    {(link.dropdown || link.isMegaMenu) && <ChevronDown size={13} />}
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
            </nav>

            {/* Action Buttons Group */}
            <div className="navbar-cta-group">
              {/* IT Solutions CTA Button */}
              <Link
                href="/contact?type=it-solutions"
                className="btn-stipend btn-it-solutions-nav"
                title="BDPS IT Solutions & Enterprise Software Services"
              >
                <Sparkles size={13} className="icon-orange-accent" />
                <span className="cta-label-text">IT Solutions</span>
                <span className="btn-stipend-tag tag-soon">SOON</span>
              </Link>

              {/* Internship CTA Button */}
              <button
                onClick={() => setInternshipModalOpen(true)}
                className={`btn-stipend btn-internship-nav ${!isInternshipActive ? 'btn-stipend-disabled' : ''}`}
                title="Apply for Internship"
              >
                <Briefcase size={13} className="icon-orange-accent" />
                <span className="cta-label-text">Internship</span>
                {!isInternshipActive && <span className="btn-stipend-tag tag-closed">CLOSED</span>}
              </button>

              {/* Stipend CTA Button */}
              {isStipendActive && (
                <button
                  onClick={() => setStipendModalOpen(true)}
                  className="btn-stipend stipend-pulse-highlight btn-stipend-nav"
                  title="Stipend Registration"
                >
                  <Award size={13} className="stipend-icon" />
                  <span className="cta-label-text">Stipend</span>
                  <span className="btn-stipend-tag tag-open">OPEN</span>
                </button>
              )}

              {/* Student Login Button */}
              <a
                href={process.env.NEXT_PUBLIC_FRAPPE_URL ? `${process.env.NEXT_PUBLIC_FRAPPE_URL}/login` : 'http://localhost:3000/login'}
                className="btn-login"
                title="Student Login Portal"
              >
                Student Login
              </a>
            </div>

            {/* Mobile Toggle Button (only on phones & portrait tablets) */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="mobile-toggle-btn"
              aria-label="Toggle mobile menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

        {/* Fullscreen Blurred Backdrop Overlay & Floating Card Menu */}
        {menuOpen && (
          <div 
            className="mobile-modal-overlay" 
            onClick={() => setMenuOpen(false)} 
            aria-modal="true"
            role="dialog"
          >
            {/* Floating Card Popup (Image 2 style) */}
            <div 
              className="mobile-popup-card" 
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button Top Right */}
              <div className="mobile-card-top">
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="mobile-card-close"
                  aria-label="Close navigation menu"
                >
                  <X size={17} />
                </button>
              </div>

              {/* Navigation Items */}
              <div className="mobile-card-items">
                {/* 1. Home */}
                <Link
                  href="/"
                  onClick={() => setMenuOpen(false)}
                  className={`mobile-card-item ${pathname === '/' ? 'mobile-card-item-active' : ''}`}
                >
                  <div className="mobile-item-left">
                    <Home size={18} className="mobile-item-icon" />
                    <span>Home</span>
                  </div>
                </Link>

                {/* 2. All Courses */}
                <div className="mobile-card-expandable">
                  <div
                    onClick={() => setMobileCoursesExpanded(!mobileCoursesExpanded)}
                    className={`mobile-card-item ${pathname.startsWith('/courses') ? 'mobile-card-item-active' : ''}`}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="mobile-item-left">
                      <BookOpen size={18} className="mobile-item-icon" />
                      <span>All Courses</span>
                    </div>
                    <ChevronDown 
                      size={15} 
                      style={{ 
                        transform: mobileCoursesExpanded ? 'rotate(180deg)' : 'none', 
                        transition: 'transform 0.2s',
                        opacity: 0.7
                      }} 
                    />
                  </div>
                  {mobileCoursesExpanded && (
                    <div className="mobile-card-subgroup">
                      <Link
                        href="/courses"
                        onClick={() => setMenuOpen(false)}
                        className="mobile-card-sublink"
                        style={{ color: '#FF7518', fontWeight: '700' }}
                      >
                        Explore All Programs →
                      </Link>
                      {liveCourses.map((c, cIdx) => (
                        <Link
                          key={cIdx}
                          href={`/courses/${c.id || c._id}`}
                          onClick={() => setMenuOpen(false)}
                          className="mobile-card-sublink"
                        >
                          {c.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* 3. Jobs */}
                <Link
                  href="/jobs"
                  onClick={() => setMenuOpen(false)}
                  className={`mobile-card-item ${pathname === '/jobs' ? 'mobile-card-item-active' : ''}`}
                >
                  <div className="mobile-item-left">
                    <Briefcase size={18} className="mobile-item-icon" />
                    <span>Jobs</span>
                  </div>
                </Link>

                {/* 4. Verify Certificate */}
                <Link
                  href="/verify-certificate"
                  onClick={() => setMenuOpen(false)}
                  className={`mobile-card-item ${pathname === '/verify-certificate' ? 'mobile-card-item-active' : ''}`}
                >
                  <div className="mobile-item-left">
                    <ShieldCheck size={18} className="mobile-item-icon" />
                    <span>Verify Certificate</span>
                  </div>
                </Link>

                {/* 5. About Us */}
                <Link
                  href="/about"
                  onClick={() => setMenuOpen(false)}
                  className={`mobile-card-item ${pathname === '/about' ? 'mobile-card-item-active' : ''}`}
                >
                  <div className="mobile-item-left">
                    <Info size={18} className="mobile-item-icon" />
                    <span>About Us</span>
                  </div>
                </Link>

                {/* 6. Contact Us */}
                <Link
                  href="/contact"
                  onClick={() => setMenuOpen(false)}
                  className={`mobile-card-item ${pathname === '/contact' ? 'mobile-card-item-active' : ''}`}
                >
                  <div className="mobile-item-left">
                    <Phone size={18} className="mobile-item-icon" />
                    <span>Contact Us</span>
                  </div>
                </Link>

                {/* Divider */}
                <div className="mobile-card-divider" />

                {/* 7. IT Solutions */}
                <Link
                  href="/contact?type=it-solutions"
                  onClick={() => setMenuOpen(false)}
                  className="mobile-card-item"
                >
                  <div className="mobile-item-left">
                    <span>IT Solutions</span>
                  </div>
                  <span className="btn-stipend-tag tag-soon">SOON</span>
                </Link>

                {/* 8. Internship */}
                <button
                  type="button"
                  onClick={() => { setMenuOpen(false); setInternshipModalOpen(true); }}
                  className="mobile-card-item"
                  style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}
                >
                  <div className="mobile-item-left">
                    <Briefcase size={18} style={{ color: '#FF7518' }} />
                    <span>Internship</span>
                  </div>
                  {!isInternshipActive && <span className="btn-stipend-tag tag-closed">CLOSED</span>}
                </button>

                {/* 9. Stipend */}
                {isStipendActive && (
                  <button
                    type="button"
                    onClick={() => { setMenuOpen(false); setStipendModalOpen(true); }}
                    className="mobile-card-item"
                    style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}
                  >
                    <div className="mobile-item-left">
                      <Award size={18} style={{ color: '#FF7518' }} />
                      <span>Stipend Registration</span>
                    </div>
                    <span className="btn-stipend-tag tag-open">OPEN</span>
                  </button>
                )}

                {/* 10. Student Login */}
                <a
                  href={process.env.NEXT_PUBLIC_FRAPPE_URL ? `${process.env.NEXT_PUBLIC_FRAPPE_URL}/login` : 'http://localhost:3000/login'}
                  onClick={() => setMenuOpen(false)}
                  className="mobile-card-item mobile-card-login"
                >
                  <div className="mobile-item-left" style={{ justifyContent: 'center', width: '100%' }}>
                    <LogIn size={18} className="mobile-item-icon" />
                    <span>Student Login</span>
                  </div>
                </a>
              </div>
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
