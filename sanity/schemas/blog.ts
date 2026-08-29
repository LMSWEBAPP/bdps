import { Rule } from 'sanity';

export const blogSchema = {
  name: 'blog',
  title: 'Blog Posts',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Blog Post Title',
      type: 'string',
      validation: (rule: Rule) => rule.required().error('Blog title is required'),
    },
    {
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule: Rule) => rule.required().error('Slug is required for post URL'),
    },
    {
      name: 'publishedAt',
      title: 'Published Date',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (rule: Rule) => rule.required(),
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Career Guidance', value: 'Career Guidance' },
          { title: 'Software Engineering', value: 'Software Engineering' },
          { title: 'Financial Accounting', value: 'Financial Accounting' },
          { title: 'Scholarships & Diplomas', value: 'Scholarships & Diplomas' },
          { title: 'Tech Trends', value: 'Tech Trends' },
        ],
      },
      initialValue: 'Career Guidance',
    },
    {
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text (for SEO)',
        },
      ],
    },
    {
      name: 'author',
      title: 'Author Name',
      type: 'string',
      initialValue: 'BDPS Academic Desk',
    },
    {
      name: 'readTime',
      title: 'Estimated Read Time (e.g. 5 min read)',
      type: 'string',
      initialValue: '5 min read',
    },
    {
      name: 'excerpt',
      title: 'Short Excerpt / Summary',
      type: 'text',
      rows: 3,
      description: 'Used for preview cards on homepage, blog list, and WhatsApp share previews.',
      validation: (rule: Rule) => rule.max(300),
    },
    {
      name: 'content',
      title: 'Post Body Content',
      type: 'array',
      of: [
        {
          type: 'block',
        },
        {
          type: 'image',
          options: { hotspot: true },
        },
      ],
    },
    {
      name: 'isFeatured',
      title: 'Feature on Homepage Carousel?',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'seoTitle',
      title: 'SEO Title (Optional Override)',
      type: 'string',
    },
    {
      name: 'seoDescription',
      title: 'SEO Meta Description (Optional Override)',
      type: 'text',
      rows: 2,
    },
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author',
      media: 'coverImage',
      date: 'publishedAt',
    },
    prepare(selection: any) {
      const { title, author, media, date } = selection;
      const dateFormatted = date ? new Date(date).toLocaleDateString() : '';
      return {
        title: title || 'Untitled Post',
        subtitle: `${author || 'BDPS Desk'} • ${dateFormatted}`,
        media,
      };
    },
  },
};
