'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Star, Clock, User, Search, Filter, BookOpen, ArrowRight, Sparkles, Award } from 'lucide-react';
import VisitorHeader from '@/components/VisitorHeader';
import VisitorFooter from '@/components/VisitorFooter';
import RatingStars from '@/components/RatingStars';

const DEFAULT_COURSES = [
  { id: '1', title: 'Post Graduate Diploma in Computer Applications (PGDCA)', category: 'Full Stack', instructor: 'Certified Coach', rating: 5.0, reviewsCount: '120+ reviews', fee: '15,000', subtitle: 'Comprehensive 1-year graduate diploma program covering office software & databases.', image: 'https://picsum.photos/seed/course-pgdca/800/600', duration: '1 Year' },
  { id: '2', title: 'Core Java & Software Programming', category: 'Software Programming', instructor: 'Senior Java Dev', rating: 5.0, reviewsCount: '150+ reviews', fee: '8,000', subtitle: 'Master object-oriented coding, collections, multi-threading, and JDBC.', image: 'https://picsum.photos/seed/course-java/800/600', duration: '3-4 Months' },
  { id: '3', title: 'Tally Prime & Financial Accounting', category: 'Financial Accounting', instructor: 'Chartered Accountant', rating: 5.0, reviewsCount: '90+ reviews', fee: '6,500', subtitle: 'Master commercial accounting, GST taxation, and balance sheet preparation.', image: 'https://picsum.photos/seed/course-tally/800/600', duration: '3 Months' }
];

function VisitorCoursesCatalogContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || 'All';

  const [allCourses, setAllCourses] = useState([]);
  const [coursesLoaded, setCoursesLoaded] = useState(false);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  // Fetch live courses from Sanity CMS
  useEffect(() => {
    fetch('/api/courses', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.courses && data.courses.length > 0) {
          setAllCourses(data.courses);
        } else {
          setAllCourses(DEFAULT_COURSES);
        }
      })
      .catch(() => setAllCourses(DEFAULT_COURSES))
      .finally(() => setCoursesLoaded(true));
  }, []);

  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
    setSelectedCategory(searchParams.get('category') || 'All');
  }, [searchParams]);

  useEffect(() => {
    let result = allCourses;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c => 
        (c.title && c.title.toLowerCase().includes(q)) || 
        (c.description && c.description.toLowerCase().includes(q)) ||
        (c.subtitle && c.subtitle.toLowerCase().includes(q)) ||
        (c.category && c.category.toLowerCase().includes(q))
      );
    }

    if (selectedCategory !== 'All') {
      result = result.filter(c => {
        if (!c.category) return false;
        return c.category.toLowerCase().includes(selectedCategory.toLowerCase());
      });
    }

    setFilteredCourses(result);
  }, [allCourses, searchQuery, selectedCategory]);

  const categoriesList = ['All', ...new Set(allCourses.map(c => c.category).filter(Boolean))];

  return (
    <div className="visitor-theme">
      <VisitorHeader />

      {/* Hero Header Banner with Search */}
      <section className="courses-banner-header">
        <div className="courses-banner-container">
          <div className="support-tag">
            <Sparkles size={14} /> 100% Practical & Placement Mapped Programs
          </div>
          <h1 className="courses-banner-title">Explore Our Flagship IT Courses</h1>
          <p className="courses-banner-desc">
            Master full-stack programming, data science, financial accounting, and diplomas with BDPS expert guidance.
          </p>

          {/* Integrated Hero Search Box */}
          <div className="courses-hero-search-box">
            <Search size={18} className="search-box-icon" />
            <input
              type="text"
              placeholder="Search course name (e.g. Java, Python, Tally, PGDCA)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="hero-search-input-field"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')} 
                className="btn-clear-search"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main Catalog Container */}
      <main className="catalog-container">
        {/* Horizontal Category Filter Pills Bar */}
        <div className="catalog-category-bar">
          <div className="category-pills-row">
            {categoriesList.map((cat, idx) => {
              const count = cat === 'All' 
                ? allCourses.length 
                : allCourses.filter(c => c.category && c.category.toLowerCase().includes(cat.toLowerCase())).length;

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedCategory(cat)}
                  className={`category-pill-btn ${selectedCategory === cat ? 'active' : ''}`}
                >
                  <span>{cat}</span>
                  <span className="pill-count-badge">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Header */}
        <div className="catalog-count-row">
          <div className="catalog-count-text">
            Showing <strong>{filteredCourses.length}</strong> {filteredCourses.length === 1 ? 'program' : 'programs'} 
            {selectedCategory !== 'All' ? ` in "${selectedCategory}"` : ''}
          </div>
        </div>

        {/* Course Cards Grid */}
        {filteredCourses.length === 0 ? (
          <div className="catalog-empty-card">
            <BookOpen size={48} className="icon-orange" />
            <h3 className="bento-card-title">No matching courses found</h3>
            <p className="about-paragraph">Try searching with a different keyword or click "All" categories.</p>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="btn-explore"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="catalog-course-grid">
            {filteredCourses.map((course) => (
              <div key={course.id || course._id} className="catalog-course-card">
                {/* Image & Badges */}
                <div className="catalog-card-image-box">
                  <img 
                    src={course.image || 'https://picsum.photos/seed/bdps/800/600'} 
                    alt={course.title} 
                    className="catalog-card-img" 
                  />
                  <div className="catalog-badge-category">
                    {course.category || 'Certification'}
                  </div>
                  {course.fee && (
                    <div className="catalog-badge-fee">
                      ₹{course.fee}
                    </div>
                  )}
                </div>

                {/* Card Content Body */}
                <div className="catalog-card-body">
                  <h3 className="catalog-card-title">
                    {course.title}
                  </h3>
                  <p className="catalog-card-desc">
                    {course.subtitle || course.tagline || 'Comprehensive hands-on training with lab practice.'}
                  </p>

                  <div className="course-rating-row">
                    <RatingStars rating={course.rating} />
                    <span className="course-rating-text">
                      {course.rating ? Number(course.rating).toFixed(1) : '5.0'} ({course.reviewsCount || '120+ reviews'})
                    </span>
                  </div>

                  <div className="course-meta-divider">
                    <div className="course-meta-item">
                      <Clock size={15} className="course-meta-icon" />
                      <span>Duration: {course.duration || '3-4 Months'}</span>
                    </div>
                    <div className="course-meta-item">
                      <User size={15} className="course-meta-icon" />
                      <span>Mentor: {course.instructor || 'Certified Coach'}</span>
                    </div>
                  </div>

                  <Link href={`/courses/${course.id || course._id}`} className="btn-catalog-details">
                    View Syllabus & Enroll <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <VisitorFooter />
    </div>
  );
}

export default function VisitorCoursesCatalog() {
  return (
    <Suspense fallback={
      <div className="section-header-center">
        <div className="logo-badge">Loading BDPS Catalog...</div>
      </div>
    }>
      <VisitorCoursesCatalogContent />
    </Suspense>
  );
}
