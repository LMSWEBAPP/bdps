import { getSanityCourses } from '@/lib/sanity.client';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // revalidate every 1 hour

export default async function sitemap() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bdpscomputer.com';
  const currentDate = new Date().toISOString();

  // Static core routes
  const staticRoutes = [
    {
      url: `${siteUrl}`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/courses`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/jobs`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/verify-certificate`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // Dynamic course routes from Sanity CMS
  let courseRoutes = [];
  try {
    const courses = await getSanityCourses();
    if (Array.isArray(courses) && courses.length > 0) {
      courseRoutes = courses.map((course) => ({
        url: `${siteUrl}/courses/${course.id || course._id}`,
        lastModified: currentDate,
        changeFrequency: 'weekly',
        priority: 0.85,
      }));
    }
  } catch (err) {
    console.error('Error generating dynamic course sitemap:', err);
  }

  return [...staticRoutes, ...courseRoutes];
}
