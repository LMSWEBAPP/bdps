export const jobPostingSchema = {
  name: 'jobPosting',
  title: 'Indian Job Listings',
  type: 'document',
  fields: [
    { name: 'adzunaId', title: 'Adzuna Job ID', type: 'string' },
    { name: 'title', title: 'Job Title', type: 'string' },
    { name: 'company', title: 'Company Name', type: 'string' },
    { name: 'location', title: 'Location', type: 'string' },
    { name: 'category', title: 'Category', type: 'string' },
    { name: 'description', title: 'Job Description', type: 'text' },
    { name: 'salaryMin', title: 'Min Salary (₹)', type: 'number' },
    { name: 'salaryMax', title: 'Max Salary (₹)', type: 'number' },
    { name: 'redirectUrl', title: 'Apply Link', type: 'url' },
    { name: 'postedAt', title: 'Date Posted', type: 'datetime' },
    { name: 'syncedAt', title: 'Last Synced At', type: 'datetime' },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'company',
    },
  },
};
