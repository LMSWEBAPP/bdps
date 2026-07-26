export const leadSubmissionSchema = {
  name: 'leadSubmission',
  title: 'Visitor Leads & Contact Inquiries',
  type: 'document',
  fields: [
    { name: 'fullName', title: 'Full Name', type: 'string', readOnly: true },
    { name: 'email', title: 'Email Address', type: 'string', readOnly: true },
    { name: 'phone', title: 'Phone Number', type: 'string', readOnly: true },
    { name: 'course', title: 'Interested Course', type: 'string', readOnly: true },
    { name: 'message', title: 'Message / Notes', type: 'text', readOnly: true },
    {
      name: 'status',
      title: 'Lead Status',
      type: 'string',
      options: { list: ['New', 'Contacted', 'Enrolled', 'Rejected'] },
      initialValue: 'New',
    },
    { name: 'adminNotes', title: 'Internal Admin Notes', type: 'text' },
    { name: 'submittedAt', title: 'Submission Date', type: 'datetime', readOnly: true },
  ],
};
