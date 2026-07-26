export const stipendApplicationSchema = {
  name: 'stipendApplication',
  title: 'Stipend Registrations',
  type: 'document',
  fields: [
    { name: 'studentName', title: 'Student Name', type: 'string', readOnly: true },
    { name: 'phone', title: 'Phone Number', type: 'string', readOnly: true },
    { name: 'email', title: 'Email Address', type: 'string', readOnly: true },
    { name: 'qualification', title: 'Educational Qualification', type: 'string', readOnly: true },
    { name: 'category', title: 'Category (General/OBC/SC/ST/EWS)', type: 'string', readOnly: true },
    { name: 'city', title: 'City / Location', type: 'string', readOnly: true },
    {
      name: 'status',
      title: 'Application Status',
      type: 'string',
      options: { list: ['Pending', 'Approved', 'Rejected'] },
      initialValue: 'Pending',
    },
    { name: 'adminNotes', title: 'Internal Admin Notes', type: 'text' },
    { name: 'submittedAt', title: 'Submission Date', type: 'datetime', readOnly: true },
  ],
};
