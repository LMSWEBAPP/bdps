'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Facebook, Twitter, Linkedin, Youtube, Instagram, ArrowRight, ShieldCheck, Briefcase } from 'lucide-react';
import InternshipModal from './forms/InternshipModal';

export default function VisitorFooter() {
  const [internshipModalOpen, setInternshipModalOpen] = useState(false);
  const [siteSettings, setSiteSettings] = useState(null);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    fetch('/api/site-settings', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.settings) {
          setSiteSettings(data.settings);
        }
      })
      .catch(() => {});
  }, []);

  const phone = siteSettings?.contactPhone || '+91 85001 08016';
  const email = siteSettings?.contactEmail || 'bdpskkd@gmail.com';
  const address = siteSettings?.address || 'Flat No. 1, Sai Prameela Apartment, B-Block, Backside Ulavacharu Restaurant, Nagamallithota Junction, Pithapuram Road, Kakinada - 533003';

  const branding = {
    title: 'BDPS Computer Education',
    shortName: 'BDPS',
    tagline: 'Learn Today | 🚀 Lead Tomorrow | 🌍 Transform Tomorrow',
    phone,
    email,
    logoText: 'BDPS'
  };

  const courseLinks = [
    { label: 'PGDCA Diploma', href: '/courses' },
    { label: 'Core Java Certification', href: '/courses' },
    { label: 'Tally Prime Accounting', href: '/courses' },
    { label: 'C Language & Web Dev', href: '/courses' },
    { label: 'Academic Projects Lab', href: '/courses' }
  ];

  const quickLinks = [
    { label: 'Apply for Internship', isModal: true },
    { label: 'Certificate Verification', href: '/verify-certificate' },
    { label: 'Job Openings & Placements', href: '/jobs' },
    { label: 'Upcoming Batches', href: '/courses' },
    { label: `About ${branding.shortName}`, href: '/about' },
    { label: 'Services Offered', href: '/courses' },
    { label: 'Student Reviews', href: '/' },
    { label: 'Contact Us', href: '/contact' }
  ];

  const socialLinks = [
    { icon: <Facebook size={18} />, href: siteSettings?.facebook || 'https://facebook.com', label: 'Facebook' },
    { icon: <Twitter size={18} />, href: siteSettings?.twitter || 'https://twitter.com', label: 'Twitter' },
    { icon: <Linkedin size={18} />, href: siteSettings?.linkedin || 'https://linkedin.com', label: 'LinkedIn' },
    { icon: <Youtube size={18} />, href: siteSettings?.youtube || 'https://youtube.com', label: 'YouTube' },
    { icon: <Instagram size={18} />, href: siteSettings?.instagram || 'https://instagram.com', label: 'Instagram' }
  ];

  return (
    <footer className="visitor-footer">
      <div className="footer-grid">
        {/* Column 1: Info & Brand */}
        <div className="footer-column">
          <div className="footer-brand-logo-row">
            <div className="footer-logo-badge">
              {branding.logoText.charAt(0)}<span className="about-heading-accent">{branding.logoText.slice(1)}</span>
            </div>
            <span className="footer-logo-title">{branding.title}</span>
          </div>
          <p className="footer-tagline">
            {branding.tagline}
          </p>
          <p className="footer-csr-tag">
            🤝 CSR Initiatives in Collaboration with Embracing Humanity Foundation (EHF)
          </p>
          <div className="footer-social-row">
            {socialLinks.map((social, idx) => (
              <a
                key={idx}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn"
                aria-label={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Column 2: Popular Courses */}
        <div className="footer-column">
          <h4 className="footer-column-title">
            Popular Programs
          </h4>
          <ul className="footer-links-list">
            {courseLinks.map((course, idx) => (
              <li key={idx}>
                <Link href={course.href} className="footer-link-item">
                  <ArrowRight size={12} className="contact-icon" /> {course.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Quick Links */}
        <div className="footer-column">
          <h4 className="footer-column-title">
            Quick Links
          </h4>
          <ul className="footer-links-list">
            {quickLinks.map((link, idx) => (
              <li key={idx}>
                {link.isModal ? (
                  <button 
                    onClick={() => setInternshipModalOpen(true)}
                    className="footer-link-item"
                    style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', cursor: 'pointer' }}
                  >
                    <ArrowRight size={12} className="contact-icon" /> {link.label}
                  </button>
                ) : (
                  <Link href={link.href} className="footer-link-item">
                    <ArrowRight size={12} className="contact-icon" /> {link.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Contact HQ */}
        <div className="footer-column">
          <h4 className="footer-column-title">
            Contact HQ
          </h4>
          <div className="footer-contact-list">
            <div className="footer-contact-item">
              <MapPin size={18} className="footer-contact-icon" />
              <span>{address}</span>
            </div>
            <div className="footer-contact-item">
              <Phone size={18} className="footer-contact-icon" />
              <a href={`tel:${phone.replace(/\s+/g, '')}`} className="footer-contact-link">{phone}</a>
            </div>
            <div className="footer-contact-item">
              <Mail size={18} className="footer-contact-icon" />
              <a href={`mailto:${email}`} className="footer-contact-link">{email}</a>
            </div>
            <div className="footer-accreditation">
              <ShieldCheck size={16} /> ISO 9001:2015 Accredited
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom-bar">
        <div>
          © {currentYear} {branding.title}. All Rights Reserved.
        </div>
        <div className="footer-bottom-links">
          <Link href="/contact" className="footer-bottom-link">Privacy Policy</Link>
          <Link href="/contact" className="footer-bottom-link">Terms of Service</Link>
        </div>
      </div>

      <InternshipModal
        isOpen={internshipModalOpen}
        onClose={() => setInternshipModalOpen(false)}
        siteSettings={siteSettings}
      />
    </footer>
  );
}
