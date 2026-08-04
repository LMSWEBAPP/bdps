'use client';

import { useState, useEffect } from 'react';
import { 
  Search, ShieldCheck, Award, Printer, ArrowLeft, 
  AlertCircle, CheckCircle2, RefreshCw, FileText, Calendar, Building2, User
} from 'lucide-react';
import VisitorHeader from '@/components/VisitorHeader';
import VisitorFooter from '@/components/VisitorFooter';

export default function VerifyCertificatePage() {
  const [regNumber, setRegNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [certificate, setCertificate] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleVerify = async (e) => {
    if (e) e.preventDefault();
    const cleanReg = regNumber.trim();
    if (!cleanReg) {
      setErrorMsg('Please enter a valid Registration or Roll Number.');
      return;
    }

    setErrorMsg('');
    setLoading(true);
    setSearched(true);

    const cacheKey = `bdps_cert_${cleanReg.toUpperCase()}`;

    // Optimization: Check client sessionStorage cache to save Sanity API quota
    if (typeof window !== 'undefined') {
      try {
        const cachedData = sessionStorage.getItem(cacheKey);
        if (cachedData) {
          const parsed = JSON.parse(cachedData);
          if (parsed.notFound) {
            setCertificate(null);
            setErrorMsg(`No official certificate record found for "${cleanReg}".`);
          } else {
            setCertificate(parsed);
          }
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn('Cache error:', err);
      }
    }

    try {
      const res = await fetch(`/api/verify-certificate?regNumber=${encodeURIComponent(cleanReg)}`);
      const data = await res.json();

      if (res.ok && data.success && data.certificate) {
        setCertificate(data.certificate);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(cacheKey, JSON.stringify(data.certificate));
        }
      } else {
        setCertificate(null);
        setErrorMsg(data.message || `No official certificate record found for Registration Number: "${cleanReg}"`);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(cacheKey, JSON.stringify({ notFound: true }));
        }
      }
    } catch (err) {
      setCertificate(null);
      setErrorMsg('Server connection error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleReset = () => {
    setRegNumber('');
    setCertificate(null);
    setSearched(false);
    setErrorMsg('');
  };

  return (
    <div className="visitor-theme">
      <VisitorHeader />

      <main className="verify-page-container">
        {/* Verification Hero Header */}
        <section className="verify-hero-section">
          <div className="verify-badge">
            <ShieldCheck size={16} /> Official Verification Portal
          </div>
          <h1 className="verify-title">
            Student Certificate Verification
          </h1>
          <p className="verify-subtitle">
            Verify academic certificates issued by BDPS Computer Education. Enter your student Registration or Roll Number below to authenticate credentials.
          </p>

          {/* Search Form */}
          <form onSubmit={handleVerify} className="verify-search-box">
            <div className="verify-input-wrapper">
              <Search size={20} className="verify-input-icon" />
              <input
                type="text"
                required
                placeholder="Enter REG Number (e.g. BDPS-2024-101)"
                value={regNumber}
                onChange={(e) => setRegNumber(e.target.value)}
                className="verify-input"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-verify-submit"
            >
              {loading ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <ShieldCheck size={18} />
                  <span>Verify Certificate</span>
                </>
              )}
            </button>
          </form>

          {/* Sample Helper Note */}
          <p className="verify-sample-hint">
            💡 <strong>Demo Sample REG Numbers:</strong> <code>BDPS-2024-101</code>, <code>BDPS-2024-102</code>, or <code>BDPS-2024-103</code>
          </p>
        </section>

        {/* Results Area */}
        <section className="verify-results-section">
          {errorMsg && (
            <div className="verify-error-card">
              <AlertCircle size={36} className="text-red-500" />
              <h3 className="verify-error-title">Certificate Not Found</h3>
              <p className="verify-error-desc">{errorMsg}</p>
              <div className="verify-error-tips">
                <strong>Troubleshooting Steps:</strong>
                <ul>
                  <li>Double-check spelling and hyphen formatting (e.g., <code>BDPS-2024-101</code>).</li>
                  <li>Ensure there are no leading or trailing blank spaces in the registration number.</li>
                  <li>If your course was recently completed, contact BDPS admissions to verify record publishing.</li>
                </ul>
              </div>
              <button onClick={handleReset} className="btn-verify-secondary">
                Search Again
              </button>
            </div>
          )}

          {/* Found Certificate Display Frame */}
          {certificate && (
            <div className="certificate-display-wrapper">
              <div className="certificate-actions-bar no-print">
                <div className="certificate-status-badge">
                  <CheckCircle2 size={18} /> Verified Official Academic Record
                </div>
                <div className="certificate-btn-group">
                  <button onClick={handlePrint} className="btn-cert-print">
                    <Printer size={16} /> Print / Save Official PDF
                  </button>
                  <button onClick={handleReset} className="btn-cert-reset">
                    <RefreshCw size={15} /> Verify Another
                  </button>
                </div>
              </div>

              {/* Official Certificate Paper Frame */}
              <div className="official-certificate-frame" id="printable-certificate">
                {/* Outer Decorative Border */}
                <div className="cert-border-outer">
                  <div className="cert-border-inner">

                    {/* Header Seal & Logo */}
                    <div className="cert-header-box">
                      <div className="cert-logo-badge">
                        <Award size={42} color="#BD601C" />
                      </div>
                      <h2 className="cert-institute-title">
                        BDPS COMPUTER EDUCATION
                      </h2>
                      <p className="cert-institute-sub">
                        PREMIER COMPUTER TRAINING INSTITUTE • ESTD 2006
                      </p>
                      <div className="cert-divider-gold"></div>
                      <h3 className="cert-main-heading">
                        CERTIFICATE OF COMPLETION
                      </h3>
                      <p className="cert-sub-heading">
                        & ACADEMIC EXCELLENCE
                      </p>
                    </div>

                    {/* Body Content */}
                    <div className="cert-body-box">
                      <p className="cert-text-present">
                        This is to proudly certify that
                      </p>

                      <h1 className="cert-student-name">
                        {certificate.fullName}
                      </h1>

                      <p className="cert-text-course">
                        has successfully completed the prescribed course of study and practical lab examination in
                      </p>

                      <h2 className="cert-course-title">
                        {certificate.courseName}
                      </h2>

                      {certificate.duration && (
                        <p className="cert-duration-text">
                          Course Duration: <strong>{certificate.duration}</strong>
                        </p>
                      )}
                    </div>

                    {/* Details Grid */}
                    <div className="cert-details-grid">
                      <div className="cert-detail-item">
                        <span className="cert-detail-label">REGISTRATION NO</span>
                        <strong className="cert-detail-value">{certificate.regNumber}</strong>
                      </div>

                      <div className="cert-detail-item">
                        <span className="cert-detail-label">DATE OF ISSUE</span>
                        <strong className="cert-detail-value">{certificate.issueDate}</strong>
                      </div>

                      <div className="cert-detail-item">
                        <span className="cert-detail-label">PERFORMANCE / GRADE</span>
                        <strong className="cert-detail-value cert-highlight-grade">
                          {certificate.grade || 'Grade A+'}
                        </strong>
                      </div>

                      <div className="cert-detail-item">
                        <span className="cert-detail-label">ISSUING CAMPUS</span>
                        <strong className="cert-detail-value">
                          {certificate.issuedBy || 'BDPS Computer Education'}
                        </strong>
                      </div>
                    </div>

                    {/* Signatures & Seal Footer */}
                    <div className="cert-footer-box">
                      <div className="cert-signature-col">
                        <div className="cert-sig-line"></div>
                        <span className="cert-sig-title">Academic Director</span>
                        <span className="cert-sig-sub">BDPS Examinations Board</span>
                      </div>

                      <div className="cert-seal-stamp">
                        <div className="cert-seal-circle">
                          <ShieldCheck size={36} color="#BD601C" />
                          <span className="cert-seal-text">VERIFIED</span>
                        </div>
                      </div>

                      <div className="cert-signature-col">
                        <div className="cert-sig-line"></div>
                        <span className="cert-sig-title">Authorized Signatory</span>
                        <span className="cert-sig-sub">Director of Studies</span>
                      </div>
                    </div>

                    <div className="cert-verification-code">
                      <span>Verification Ref ID: <strong>{certificate.certificateId || `CERT-${certificate.regNumber}`}</strong></span>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      <VisitorFooter />
    </div>
  );
}
