import { getSanityCourseById } from '@/lib/sanity.client';
import CourseClientView, { DEFAULT_COURSES_DB } from './CourseClientView';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.bdpsit.com';

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const courseId = resolvedParams?.id || '1';

  let course = null;
  try {
    course = await getSanityCourseById(courseId);
  } catch (error) {
    console.error('Error fetching course metadata for page:', error);
  }

  // Fallback to local default DB if Sanity returns null
  if (!course && DEFAULT_COURSES_DB[courseId]) {
    course = DEFAULT_COURSES_DB[courseId];
  }

  const title = course?.title
    ? `${course.title} | BDPS Computer Education`
    : 'BDPS Computer Education | Top IT & Computer Training Institute';
  
  const description = course?.subtitle || course?.description || 
    'Master Full Stack Development, Java, Python AI, Tally Prime, and PGDCA with BDPS Computer Education Kakinada.';

  let rawImageUrl = course?.image || course?.thumbnail || `${siteUrl}/icon.png`;
  // Ensure image URL is absolute for social crawlers (WhatsApp, Facebook, Twitter)
  if (rawImageUrl.startsWith('/')) {
    rawImageUrl = `${siteUrl}${rawImageUrl}`;
  }

  const canonicalUrl = `${siteUrl}/courses/${courseId}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'BDPS Computer Education',
      locale: 'en_IN',
      type: 'website',
      images: [
        {
          url: rawImageUrl,
          width: 1200,
          height: 630,
          alt: course?.title || 'BDPS Course Preview',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [rawImageUrl],
    },
  };
}

export default function CourseDetailsPage(props) {
  return <CourseClientView {...props} />;
}
