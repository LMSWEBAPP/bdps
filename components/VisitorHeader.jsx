'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Search, ChevronDown, Award, Phone, Mail, Clock, MapPin, Menu, X, ShieldCheck
} from 'lucide-react';
import StipendRegistrationModal from './StipendRegistrationModal';

export default function VisitorHeader() {
  const pathname = usePathname();
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [stipendModalOpen, setStipendModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Dynamic Site Settings from Sanity CMS (Zero flicker with sessionStorage cache)
  const [siteSettings, setSiteSettings] = useState(null);

  useEffect(() => {
    // Check local session cache for instant zero-flash rendering
    try {
      const cachedActive = sessionStorage.getItem('bdps_stipend_active');
      if (cachedActive !== null) {
        setSiteSettings({
          stipendRegistrationActive: cachedActive === 'true',
          stipendNoticeText: sessionStorage.getItem('bdps_stipend_notice') || 'Stipend registrations for the current batch are now closed.'
        });
      }
    } catch (e) {}

    // Fresh fetch from Sanity API
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
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinks = [
    { title: 'Home', href: '/' },
    { title: 'All Courses', href: '/courses' },
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

  return (
    <>
      {/* Top Contact Bar */}
      <div className="visitor-top-bar">
        <div className="top-bar-contact">
          <a href="tel:+918309974799" className="top-bar-link">
            <Phone size={13} /> +91 83099 74799
          </a>
          <a href="mailto:bdpsdocs@gmail.com" className="top-bar-link">
            <Mail size={13} /> bdpsdocs@gmail.com
          </a>
        </div>
        <div className="top-bar-links-group">
          <Link href="/about" className="top-bar-sublink">
            Our Legacy (Since 2006)
          </Link>
          <span className="top-bar-divider">|</span>
          <Link href="/contact?type=collaboration" className="top-bar-sublink">
            Placement Alliances
          </Link>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header className="visitor-navbar">
        <div className="navbar-container">
          {/* Logo */}
          <Link href="/" className="navbar-logo">
            <div className="logo-badge">BDPS</div>
            <div className="logo-title-group">
              <span className="logo-title">BDPS Computer Education</span>
              <span className="logo-subtitle">COMPUTER TRAINING INSTITUTE</span>
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
                onMouseEnter={() => link.dropdown && setActiveDropdown(idx)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={link.href}
                  className={`nav-item-link ${pathname === link.href ? 'active' : ''}`}
                >
                  {link.title}
                  {link.dropdown && <ChevronDown size={14} />}
                </Link>

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
              </div>
            ))}

            <div className="header-cta-group">
              {isStipendActive && (
                <button
                  onClick={() => setStipendModalOpen(true)}
                  className="btn-stipend stipend-pulse-highlight"
                >
                  <Award size={15} className="stipend-icon" />
                  <span>Stipend Registration</span>
                  <span className="btn-stipend-tag tag-open">
                    OPEN
                  </span>
                </button>
              )}
              <a
                href={process.env.NEXT_PUBLIC_FRAPPE_URL ? `${process.env.NEXT_PUBLIC_FRAPPE_URL}/login` : 'http://localhost:3000/login'}
                className="btn-login"
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
    </>
  );
}
