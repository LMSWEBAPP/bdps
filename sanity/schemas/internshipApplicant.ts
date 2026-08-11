export const internshipApplicantSchema = {
  name: 'internshipApplicant',
  title: 'Internship Applicants',
  type: 'document',
  fields: [
    { name: 'fullName', title: 'Full Name', type: 'string', readOnly: true },
    { name: 'phone', title: 'Phone Number', type: 'string', readOnly: true },
    { name: 'email', title: 'Email Address', type: 'string', readOnly: true },
    { name: 'course', title: 'Applied Course / Domain', type: 'string', readOnly: true },
    { name: 'qualification', title: 'Educational Qualification', type: 'string', readOnly: true },
    { name: 'preferredBatch', title: 'Preferred Batch / Shift', type: 'string', readOnly: true },
    { name: 'notes', title: 'Cover Note / Additional Details', type: 'text', readOnly: true },
    {
      name: 'status',
      title: 'Application Status',
      type: 'string',
      options: { list: ['Pending', 'Under Review', 'Shortlisted', 'Rejected'] },
      initialValue: 'Pending',
    },
    { name: 'adminNotes', title: 'Internal Admin Notes', type: 'text' },
    { name: 'submittedAt', title: 'Submission Date', type: 'datetime', readOnly: true },
  ],
};
