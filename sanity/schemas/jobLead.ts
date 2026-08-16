export const jobLeadSchema = {
  name: 'jobLead',
  title: 'Job Portal Applications / Leads',
  type: 'document',
  fields: [
    { name: 'fullName', title: 'Full Name', type: 'string', readOnly: true },
    { name: 'email', title: 'Email Address', type: 'string', readOnly: true },
    { name: 'phone', title: 'Phone / WhatsApp Number', type: 'string', readOnly: true },
    { name: 'jobTitle', title: 'Target Job Title', type: 'string', readOnly: true },
    { name: 'company', title: 'Hiring Company', type: 'string', readOnly: true },
    { name: 'qualification', title: 'Highest Qualification', type: 'string', readOnly: true },
    { name: 'experience', title: 'Experience Level', type: 'string', readOnly: true },
    { name: 'city', title: 'Current City', type: 'string', readOnly: true },
    { name: 'appliedJobUrl', title: 'Official Job Portal Link', type: 'url', readOnly: true },
    {
      name: 'status',
      title: 'Lead Status',
      type: 'string',
      options: { list: ['New', 'Contacted', 'Shortlisted', 'Interviewed', 'Placed', 'Closed'] },
      initialValue: 'New',
    },
    { name: 'adminNotes', title: 'Internal Admin Notes', type: 'text' },
    { name: 'appliedAt', title: 'Application Date', type: 'datetime', readOnly: true },
  ],
  preview: {
    select: {
      title: 'fullName',
      subtitle: 'jobTitle',
      description: 'company',
    },
    prepare(selection: any) {
      const { title, subtitle, description } = selection;
      return {
        title: title || 'Anonymous Applicant',
        subtitle: `${subtitle || 'Job Application'} at ${description || 'Direct Employer'}`,
      };
    },
  },
};
