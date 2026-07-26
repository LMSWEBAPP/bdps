'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { MapPin, Phone, Mail, Send, CheckCircle2, Clock, Building, Handshake } from 'lucide-react';
import VisitorHeader from '@/components/VisitorHeader';
import VisitorFooter from '@/components/VisitorFooter';

function ContactFormContent() {
  const searchParams = useSearchParams();
  const formType = searchParams.get('type') || 'student';
  const isCollab = formType === 'collaboration';

  const branches = [
    {
      name: 'Kakinada Campus (Corporate HQ)',
      address: 'Flat No. 1, Sai Prameela Apartment, B-Block, Backside Ulavacharu Restaurant, Nagamallithota Junction, Pithapuram Road, Kakinada - 533003',
      phone: '+91 83099 74799',
      email: 'bdpsdocs@gmail.com',
      mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3815.7196022838426!2d82.25141071112674!3d16.988220084364417!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a3828414ca0cd97%3A0x88981e6992d9f2d1!2sNagamallithota%20Junction%2C%20Kakinada%2C%20Andhra%20Pradesh%20533003!5e0!3m2!1sen!2sin!4v1720000000000!5m2!1sen!2sin'
    }
  ];

  // Forms states
  const [studentForm, setStudentForm] = useState({
    name: '',
    email: '',
    phone: '',
    course: 'General Inquiry',
    message: ''
  });

  const [collabForm, setCollabForm] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    collabType: 'Placement Partnership',
    message: ''
  });

  const [status, setStatus] = useState({
    loading: false,
    success: false,
    error: null
  });

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    if (!studentForm.name || !studentForm.email || !studentForm.phone) {
      setStatus({ loading: false, success: false, error: 'Please enter your Name, Email, and Phone number.' });
      return;
    }

    setStatus({ loading: true, success: false, error: null });

    try {
      const res = await fetch('/api/submit-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: studentForm.name,
          email: studentForm.email,
          phone: studentForm.phone,
          course: studentForm.course,
          message: studentForm.message
        })
      });

      const data = await res.json();
      if (data.success) {
        setStatus({ loading: false, success: true, error: null });
        setStudentForm({ name: '', email: '', phone: '', course: 'General Inquiry', message: '' });
      } else {
        setStatus({ loading: false, success: false, error: data.message || 'Submission failed.' });
      }
    } catch (err) {
      setStatus({ loading: false, success: false, error: 'Connection error. Please try again.' });
    }
  };

  const handleCollabSubmit = async (e) => {
    e.preventDefault();
    if (!collabForm.companyName || !collabForm.contactName || !collabForm.email || !collabForm.phone) {
      setStatus({ loading: false, success: false, error: 'Please fill in Company, Contact Person, Email, and Phone.' });
      return;
    }

    setStatus({ loading: true, success: false, error: null });

    try {
      const res = await fetch('/api/submit-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: collabForm.contactName,
          email: collabForm.email,
          phone: collabForm.phone,
          course: `Collaboration: ${collabForm.collabType}`,
          message: `Company/Org: ${collabForm.companyName} | Details: ${collabForm.message}`
        })
      });

      const data = await res.json();
      if (data.success) {
        setStatus({ loading: false, success: true, error: null });
        setCollabForm({ companyName: '', contactName: '', email: '', phone: '', collabType: 'Placement Partnership', message: '' });
      } else {
        setStatus({ loading: false, success: false, error: data.message || 'Submission failed.' });
      }
    } catch (err) {
      setStatus({ loading: false, success: false, error: 'Connection error. Please try again.' });
    }
  };

  return (
    <div className="visitor-theme">
      <VisitorHeader />

      {/* Header Banner */}
      <section className="page-banner-header">
        <div className="page-banner-container">
          <h1 className="page-banner-title">
            {isCollab ? 'Corporate & Institutional Collaboration' : 'Contact Our Advisors'}
          </h1>
          <p className="page-banner-desc">
            {isCollab
              ? 'Partner with BDPS to recruit skilled software talent, execute corporate training bootcamps, or sponsor academic project labs.'
              : 'Get in touch to clear course doubts, check batch timings, or request custom syllabus modules.'
            }
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="contact-container">
        <div className="contact-grid">
          {/* Left: Contact Info & Corporate HQ Map Card */}
          <div className="contact-card">
            {branches.map((branch, idx) => (
              <div key={idx} className="contact-card-inner">
                <h3 className="contact-card-title">
                  {isCollab ? 'Corporate Alliances Desk' : branch.name}
                </h3>
                <p className="about-paragraph">
                  {isCollab
                    ? 'BDPS works closely with software enterprises, accounting firms, and technical colleges to bridge academic preparation and hiring needs.'
                    : 'Visit our primary campus in Kakinada to review lab setups, interact with faculty mentors, or request course counseling.'
                  }
                </p>

                <div className="contact-info-list">
                  <div className="contact-detail-row">
                    <MapPin size={18} className="contact-icon" />
                    <span>{branch.address}</span>
                  </div>
                  <div className="contact-detail-row">
                    <Phone size={18} className="contact-icon" />
                    <a href={`tel:${branch.phone}`} className="footer-contact-link">{branch.phone}</a>
                  </div>
                  <div className="contact-detail-row">
                    <Mail size={18} className="contact-icon" />
                    <a href={`mailto:${branch.email}`} className="footer-contact-link">{branch.email}</a>
                  </div>
                  <div className="contact-detail-row">
                    <Clock size={18} className="contact-icon" />
                    <span><strong>Office Timings:</strong> Mon - Sat: 7:30 AM - 8:30 PM IST</span>
                  </div>
                </div>

                {/* Map Wrapper Expands to Fill Available Height */}
                <div className="contact-map-wrapper">
                  <iframe
                    src={branch.mapEmbedUrl}
                    width="100%"
                    height="100%"
                    className="contact-map-frame"
                    allowFullScreen=""
                    loading="lazy"
                    title="BDPS Location Map"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Right: Form Card */}
          <div className="contact-form-card">
            <h3 className="contact-card-title">
              {isCollab ? 'Submit Collaboration Proposal' : 'Leave a Message'}
            </h3>

            {status.success ? (
              <div className="form-success-banner">
                <CheckCircle2 size={42} className="success-icon" />
                <h4 className="success-title">
                  {isCollab ? 'Proposal Received!' : 'Message Submitted!'}
                </h4>
                <p className="success-desc">
                  {isCollab
                    ? 'Thank you for reaching out. Our Corporate Placement Desk will contact you within 24 hours.'
                    : 'Our academic counselor will reach out to you within 24 hours.'
                  }
                </p>
              </div>
            ) : isCollab ? (
              /* Collaboration Form */
              <form onSubmit={handleCollabSubmit} className="form-block-column">
                {status.error && (
                  <div className="form-error-alert">{status.error}</div>
                )}

                <div className="form-group-block">
                  <label className="form-label">COMPANY / INSTITUTION NAME *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter company or college name"
                    value={collabForm.companyName}
                    onChange={(e) => setCollabForm({ ...collabForm, companyName: e.target.value })}
                    className="form-input-plain"
                  />
                </div>

                <div className="form-group-block">
                  <label className="form-label">CONTACT PERSON NAME *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter full name of representative"
                    value={collabForm.contactName}
                    onChange={(e) => setCollabForm({ ...collabForm, contactName: e.target.value })}
                    className="form-input-plain"
                  />
                </div>

                <div className="form-group-block">
                  <label className="form-label">OFFICIAL EMAIL ADDRESS *</label>
                  <input
                    type="email"
                    required
                    placeholder="official@company.com"
                    value={collabForm.email}
                    onChange={(e) => setCollabForm({ ...collabForm, email: e.target.value })}
                    className="form-input-plain"
                  />
                </div>

                <div className="form-group-block">
                  <label className="form-label">PHONE NUMBER *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 9999999999"
                    value={collabForm.phone}
                    onChange={(e) => setCollabForm({ ...collabForm, phone: e.target.value })}
                    className="form-input-plain"
                  />
                </div>

                <div className="form-group-block">
                  <label className="form-label">COLLABORATION TYPE</label>
                  <select
                    value={collabForm.collabType}
                    onChange={(e) => setCollabForm({ ...collabForm, collabType: e.target.value })}
                    className="form-select-plain"
                  >
                    <option value="Placement Partnership">Campus Placement / Talent Recruitment</option>
                    <option value="Corporate Upskilling">Corporate Employee Upskilling</option>
                    <option value="Lab Sponsorship">Lab & Capstone Project Sponsorship</option>
                    <option value="Guest Lecture">Guest Lecture & IEEE Workshops</option>
                  </select>
                </div>

                <div className="form-group-block">
                  <label className="form-label">PROPOSAL DETAILS / REQUIREMENTS</label>
                  <textarea
                    rows={3}
                    placeholder="Briefly describe your requirements or partnership scope..."
                    value={collabForm.message}
                    onChange={(e) => setCollabForm({ ...collabForm, message: e.target.value })}
                    className="form-textarea-plain"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status.loading}
                  className="btn-submit-orange"
                >
                  <Handshake size={16} /> {status.loading ? 'Submitting...' : 'Submit Partnership Proposal'}
                </button>
              </form>
            ) : (
              /* Student Form */
              <form onSubmit={handleStudentSubmit} className="form-block-column">
                {status.error && (
                  <div className="form-error-alert">{status.error}</div>
                )}

                <div className="form-group-block">
                  <label className="form-label">FULL NAME *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={studentForm.name}
                    onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                    className="form-input-plain"
                  />
                </div>

                <div className="form-group-block">
                  <label className="form-label">EMAIL ADDRESS *</label>
                  <input
                    type="email"
                    required
                    placeholder="name@email.com"
                    value={studentForm.email}
                    onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                    className="form-input-plain"
                  />
                </div>

                <div className="form-group-block">
                  <label className="form-label">PHONE NUMBER *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 9999999999"
                    value={studentForm.phone}
                    onChange={(e) => setStudentForm({ ...studentForm, phone: e.target.value })}
                    className="form-input-plain"
                  />
                </div>

                <div className="form-group-block">
                  <label className="form-label">INTERESTED PROGRAM</label>
                  <select
                    value={studentForm.course}
                    onChange={(e) => setStudentForm({ ...studentForm, course: e.target.value })}
                    className="form-select-plain"
                  >
                    <option value="General Inquiry">General Counseling</option>
                    <option value="Software Development">Software Development (Full Stack)</option>
                    <option value="Data Science & AI">Data Science & AI</option>
                    <option value="Tally Prime">Tally Prime & GST</option>
                    <option value="PGDCA Diploma">PGDCA Diploma</option>
                  </select>
                </div>

                <div className="form-group-block">
                  <label className="form-label">MESSAGE</label>
                  <textarea
                    rows={3}
                    placeholder="Tell us what you'd like to achieve..."
                    value={studentForm.message}
                    onChange={(e) => setStudentForm({ ...studentForm, message: e.target.value })}
                    className="form-textarea-plain"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status.loading}
                  className="btn-submit-orange"
                >
                  <Send size={16} /> {status.loading ? 'Submitting...' : 'Submit Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <VisitorFooter />
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div>Loading contact page...</div>}>
      <ContactFormContent />
    </Suspense>
  );
}
