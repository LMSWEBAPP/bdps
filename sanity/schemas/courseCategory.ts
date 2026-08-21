export const courseCategorySchema = {
  name: 'courseCategory',
  title: 'Course Category',
  type: 'document',
  fields: [
    { name: 'title', title: 'Category Name', type: 'string', validation: (Rule: any) => Rule.required() },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title', maxLength: 96 } },
    { name: 'description', title: 'Short Description', type: 'text', rows: 2 },
    { name: 'icon', title: 'Lucide Icon Name (e.g. Code, Database, ShieldAlert)', type: 'string' },
    { name: 'order', title: 'Display Order Position', type: 'number', initialValue: 0 },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
    },
  },
};
