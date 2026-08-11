'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Briefcase, Search, MapPin, Building2, Calendar, 
  ExternalLink, Sparkles, Filter, IndianRupee, Layers, GraduationCap
} from 'lucide-react';
import VisitorHeader from '@/components/VisitorHeader';
import VisitorFooter from '@/components/VisitorFooter';
import InternshipModal from '@/components/forms/InternshipModal';

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [internshipModalOpen, setInternshipModalOpen] = useState(false);
  const [siteSettings, setSiteSettings] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const JOBS_PER_PAGE = 6;

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

  const fetchJobs = async () => {
    setLoading(true);
    setCurrentPage(1);
    try {
      const queryParams = new URLSearchParams();
      if (searchQuery) queryParams.append('search', searchQuery);
      if (selectedCategory !== 'All') queryParams.append('category', selectedCategory);
      if (selectedLocation !== 'All') queryParams.append('location', selectedLocation);

      const res = await fetch(`/api/jobs?${queryParams.toString()}`);
      const data = await res.json();
      if (data.success && data.jobs) {
        setJobs(data.jobs);
      }
    } catch (err) {
      console.error('Failed to load jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [selectedCategory, selectedLocation]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const formatSalary = (min, max) => {
    if (!min && !max) return 'As per Industry Standards';
    const formatNum = (num) => (num >= 100000 ? `₹${(num / 100000).toFixed(1)} LPA` : `₹${num.toLocaleString('en-IN')}`);
    if (min && max) return `${formatNum(min)} - ${formatNum(max)}`;
    if (min) return `From ${formatNum(min)}`;
    return `Up to ${formatNum(max)}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recently';
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? 'Recently' : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // Pagination calculations
  const totalPages = Math.ceil(jobs.length / JOBS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * JOBS_PER_PAGE;
  const endIndex = Math.min(startIndex + JOBS_PER_PAGE, jobs.length);
  const paginatedJobs = jobs.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 380, behavior: 'smooth' });
    }
  };

  const categories = ['All', 'IT Jobs', 'Accounting', 'Engineering', 'Customer Service'];
  const locations = ['All', 'Hyderabad', 'Visakhapatnam', 'Bengaluru', 'Chennai', 'Mumbai'];

  return (
    <div className="visitor-theme">
      <VisitorHeader />

      {/* Hero Header Banner */}
      <section className="courses-banner-header">
        <div className="courses-banner-container">
          <div className="support-tag">
            <Sparkles size={14} /> Daily Auto-Synced Indian Job Opportunities
          </div>
          <h1 className="courses-banner-title">
            Explore Latest Indian Vacancies & Campus Hiring
          </h1>
          <p className="courses-banner-desc">
            Discover real-time verified job openings in Software Engineering, Java, Full Stack, Tally Accounting, and Data Operations across India & AP region.
          </p>

          {/* Integrated Search Box */}
          <form onSubmit={handleSearchSubmit} className="courses-hero-search-box">
            <Search size={18} className="search-box-icon" />
            <input
              type="text"
              placeholder="Search job title, skill, or company (e.g. Java, Developer, Tally, Hyderabad)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="hero-search-input-field"
            />
            {searchQuery ? (
              <button 
                type="button" 
                onClick={() => { setSearchQuery(''); fetchJobs(); }} 
                className="btn-clear-search"
              >
                Clear
              </button>
            ) : (
              <button type="submit" className="btn-clear-search" style={{ backgroundColor: '#FF7518', color: '#fff' }}>
                Search
              </button>
            )}
          </form>

          {/* Internship Callout Banner */}
          <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Looking for Internship Opportunities?</span>
            <button
              type="button"
              onClick={() => setInternshipModalOpen(true)}
              className={`btn-stipend ${siteSettings?.internshipActive === false ? 'btn-stipend-disabled' : ''}`}
              style={{
                backgroundColor: siteSettings?.internshipActive === false ? '#1e293b' : '#FF7518',
                color: '#ffffff',
                borderColor: siteSettings?.internshipActive === false ? '#334155' : '#FF7518',
                fontWeight: '600',
                padding: '8px 18px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <GraduationCap size={16} /> Apply for BDPS Internship
              {siteSettings?.internshipActive === false && (
                <span className="btn-stipend-tag tag-closed" style={{ marginLeft: '4px' }}>CLOSED</span>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Container */}
      <main className="catalog-container">
        {/* Status Bar & Controls */}
        <div className="job-controls-bar">
          <div className="job-filters-group">
            {/* Category Filters */}
            <div className="category-pills-row">
              <span className="filter-label"><Layers size={14} /> Category:</span>
              {categories.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedCategory(cat)}
                  className={`category-pill-btn ${selectedCategory === cat ? 'active' : ''}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Location Filters */}
            <div className="category-pills-row">
              <span className="filter-label"><MapPin size={14} /> Location:</span>
              {locations.map((loc, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedLocation(loc)}
                  className={`category-pill-btn ${selectedLocation === loc ? 'active' : ''}`}
                >
                  {loc === 'All' ? 'All India' : loc}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="catalog-count-row">
          <div className="catalog-count-text">
            {jobs.length > 0 ? (
              <>Showing <strong>{startIndex + 1} - {endIndex}</strong> of <strong>{jobs.length}</strong> active job listings in India (Page {currentPage} of {totalPages})</>
            ) : (
              <>Showing <strong>0</strong> job listings</>
            )}
          </div>
        </div>

        {/* Jobs Grid */}
        {loading ? (
          <div className="section-header-center" style={{ padding: '60px 0' }}>
            <div className="logo-badge">Loading Adzuna Verified Indian Jobs...</div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="catalog-empty-card">
            <Briefcase size={48} className="icon-orange" />
            <h3 className="bento-card-title">No matching jobs found</h3>
            <p className="about-paragraph">Try searching with a different keyword or click "Refresh Latest Jobs".</p>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setSelectedLocation('All'); fetchJobs(); }}
              className="btn-explore"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            <div className="jobs-cards-grid">
              {paginatedJobs.map((job) => (
                <div key={job._id || job.adzunaId} className="job-card-item">
                  <div className="job-card-header">
                    <div className="job-badge-category">
                      {job.category || 'IT Jobs'}
                    </div>
                    <span className="job-posted-date">
                      <Calendar size={13} /> {formatDate(job.postedAt)}
                    </span>
                  </div>

                  <h3 className="job-title-text">{job.title}</h3>

                  <div className="job-company-row">
                    <Building2 size={15} className="icon-orange" />
                    <span className="job-company-name">{job.company || 'Direct Employer'}</span>
                  </div>

                  <div className="job-meta-row">
                    <div className="job-meta-tag">
                      <MapPin size={14} className="icon-orange" />
                      <span>{job.location || 'India'}</span>
                    </div>
                    <div className="job-meta-tag salary-tag">
                      <IndianRupee size={14} />
                      <span>{formatSalary(job.salaryMin, job.salaryMax)}</span>
                    </div>
                  </div>

                  <p className="job-description-snippet">
                    {job.description ? `${job.description.slice(0, 160)}...` : 'Comprehensive role details available on application portal.'}
                  </p>

                  <div className="job-card-footer">
                    <a
                      href={job.redirectUrl || 'https://www.adzuna.in'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-apply-job"
                    >
                      Apply on Official Portal <ExternalLink size={15} />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="jobs-pagination-bar">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="pagination-btn nav-btn"
                >
                  ← Previous
                </button>

                <div className="pagination-numbers">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`pagination-btn num-btn ${currentPage === pageNum ? 'active' : ''}`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="pagination-btn nav-btn"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <VisitorFooter />

      <InternshipModal
        isOpen={internshipModalOpen}
        onClose={() => setInternshipModalOpen(false)}
        siteSettings={siteSettings}
      />
    </div>
  );
}
