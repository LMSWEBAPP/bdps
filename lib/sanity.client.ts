import { createClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder_project_id';
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01';

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
});

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: any) {
  if (!source) return '';
  return builder.image(source).url();
}

export async function getSanityCourses() {
  try {
    const query = `*[_type == "course" && !(_id in path("drafts.**"))] | order(_createdAt desc) {
      "_id": _id,
      "id": _id,
      title,
      "slug": slug.current,
      category,
      subtitle,
      "tagline": subtitle,
      duration,
      fee,
      instructor,
      rating,
      reviewsCount,
      "image": thumbnail.asset->url,
      description,
      isFeatured
    }`;
    const courses = await sanityClient.fetch(query, {}, { cache: 'no-store', next: { revalidate: 0 } });
    return courses || [];
  } catch (error) {
    console.error('Error fetching courses from Sanity:', error);
    return [];
  }
}

export async function getSanityCourseById(id: string) {
  try {
    const query = `*[_type == "course" && !(_id in path("drafts.**")) && (_id == $id || slug.current == $id)][0] {
      "_id": _id,
      "id": _id,
      title,
      "slug": slug.current,
      category,
      subtitle,
      "tagline": subtitle,
      duration,
      fee,
      instructor,
      rating,
      reviewsCount,
      "image": thumbnail.asset->url,
      syllabus,
      description,
      isFeatured
    }`;
    const course = await sanityClient.fetch(query, { id }, { cache: 'no-store', next: { revalidate: 0 } });
    return course;
  } catch (error) {
    console.error('Error fetching course by ID from Sanity:', error);
    return null;
  }
}

export async function getSanityPopupAd() {
  try {
    const query = `*[_type == "popupAd" && isActive == true && !(_id in path("drafts.**"))] | order(_updatedAt desc)[0] {
      title,
      "image": bannerImage.asset->url,
      targetUrl,
      buttonText
    }`;
    const ad = await sanityClient.fetch(query, {}, { cache: 'no-store', next: { revalidate: 0 } });
    return ad || null;
  } catch (error) {
    console.error('Error fetching popup ad from Sanity:', error);
    return null;
  }
}

export async function getSanitySiteSettings() {
  try {
    const query = `*[_type == "siteSettings" && !(_id in path("drafts.**"))] | order(_updatedAt desc)[0] {
      announcementBanner,
      stipendRegistrationActive,
      stipendNoticeText,
      internshipActive,
      internshipNoticeText,
      internshipCourses,
      contactEmail,
      contactPhone,
      whatsappNumber,
      address,
      facebook,
      instagram,
      linkedin,
      youtube,
      twitter
    }`;
    const settings = await sanityClient.fetch(query, {}, { cache: 'no-store', next: { revalidate: 0 } });
    return settings || null;
  } catch (error) {
    console.error('Error fetching site settings from Sanity:', error);
    return null;
  }
}

export async function getSanityHeroSlides() {
  try {
    const query = `*[_type == "heroSlide" && !(_id in path("drafts.**"))] | order(order asc, _createdAt desc) {
      "_id": _id,
      title,
      subtitle,
      "desc": description,
      "image": slideImage.asset->url,
      backgroundPreset,
      customBackground,
      "bgImage": backgroundImage.asset->url,
      buttonText,
      buttonLink,
      secondaryButtonText,
      secondaryButtonLink
    }`;
    const slides = await sanityClient.fetch(query, {}, { cache: 'no-store', next: { revalidate: 0 } });
    return slides || [];
  } catch (error) {
    console.error('Error fetching hero slides from Sanity:', error);
    return [];
  }
}
