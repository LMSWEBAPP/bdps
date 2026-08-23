import Link from 'next/link';
import { Lock, ShieldCheck, PhoneCall, ExternalLink, ArrowRight, BookOpen, UserCheck } from 'lucide-react';
import VisitorHeader from '@/components/VisitorHeader';
import VisitorFooter from '@/components/VisitorFooter';

export const metadata = {
  title: 'Student Login Portal | BDPS Computer Education',
  description: 'Official student login portal for registered candidates of BDPS Computer Education.',
};

export default function LoginPage() {
  const frappeUrl = process.env.NEXT_PUBLIC_FRAPPE_URL;

  return (
    <div className="visitor-layout-wrapper">
      <VisitorHeader />

      <main className="visitor-main-content student-login-page-wrapper">
        <section className="student-login-hero-section">
          <div className="section-container">
            <div className="student-login-page-card">
              <div className="student-login-header">
                <div className="student-login-badge">
                  <ShieldCheck size={14} /> Registered Student Access Only
                </div>
                <h1 className="student-login-title">
                  BDPS Student Portal Login
                </h1>
                <p className="student-login-subtitle">
                  Secure account access for enrolled candidates & course students
                </p>
              </div>

              <div className="modal-body student-login-body">
                <div className="student-notice-box">
                  <div className="student-notice-icon-wrapper">
                    <Lock size={32} className="student-notice-icon" />
                  </div>
                  <div className="student-notice-content">
                    <h2 className="student-notice-heading">Official Registration Required</h2>
                    <p className="student-notice-text">
                      This login portal is exclusively accessible to candidates who have officially completed their course registration with <strong>BDPS Computer Education</strong>.
                    </p>
                    <p className="student-notice-subtext">
                      Enrolled students can log in using their credentials issued at registration. If you are a new applicant or need account activation, please reach out to our administration desk.
                    </p>
                  </div>
                </div>

                <div className="student-modal-actions">
                  {frappeUrl ? (
                    <a
                      href={`${frappeUrl}/login`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-student-proceed"
                    >
                      <span>Proceed to ERP Portal</span>
                      <ExternalLink size={16} />
                    </a>
                  ) : (
                    <Link
                      href="/contact?type=student"
                      className="btn-student-proceed"
                    >
                      <span>Contact Admissions Desk for Access</span>
                      <ArrowRight size={16} />
                    </Link>
                  )}

                  <div className="student-modal-secondary-row">
                    <Link
                      href="/courses"
                      className="btn-student-outline"
                    >
                      <BookOpen size={15} />
                      <span>Explore BDPS Courses</span>
                    </Link>
                    <Link
                      href="/contact?type=student"
                      className="btn-student-outline"
                    >
                      <PhoneCall size={15} />
                      <span>Contact Support</span>
                    </Link>
                  </div>
                </div>

                <div className="student-notice-footer">
                  <span>🔒 Protected by BDPS Computer Education & IT Solutions</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <VisitorFooter />
    </div>
  );
}
