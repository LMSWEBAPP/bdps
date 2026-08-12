export const testimonialSchema = {
  name: 'testimonial',
  title: 'Student Testimonials',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Student Name',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'role',
      title: 'Placed Role / Job Title',
      type: 'string',
      description: 'e.g. Junior Java Developer, Systems Operator, Junior Accountant',
    },
    {
      name: 'company',
      title: 'Company Name',
      type: 'string',
      description: 'e.g. Tech Services, Enterprise Ltd, Finance Corp',
    },
    {
      name: 'courseName',
      title: 'Course Completed',
      type: 'string',
      description: 'e.g. Core Java & Software Programming, PGDCA Diploma',
    },
    {
      name: 'quote',
      title: 'Student Testimonial / Feedback Quote',
      type: 'text',
      rows: 4,
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'rating',
      title: 'Rating Stars (1 - 5)',
      type: 'number',
      initialValue: 5,
      validation: (Rule: any) => Rule.min(1).max(5),
    },
    {
      name: 'avatar',
      title: 'Student Photo (Optional)',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'order',
      title: 'Display Priority Order',
      type: 'number',
      initialValue: 1,
      description: 'Lower numbers display first.',
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'courseName',
      media: 'avatar',
    },
  },
};
