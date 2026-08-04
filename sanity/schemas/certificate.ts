export const certificateSchema = {
  name: 'certificate',
  title: 'Student Certificates',
  type: 'document',
  fields: [
    {
      name: 'regNumber',
      title: 'Registration / Roll Number',
      type: 'string',
      description: 'Unique Student Registration or Roll Number (e.g. BDPS-2024-101)',
      validation: (Rule: any) => Rule.required().error('Registration Number is required'),
    },
    {
      name: 'fullName',
      title: 'Student Full Name',
      type: 'string',
      description: 'Full name of the student as printed on certificate',
      validation: (Rule: any) => Rule.required().error('Student name is required'),
    },
    {
      name: 'courseName',
      title: 'Course / Training Program Name',
      type: 'string',
      description: 'Completed course title (e.g. PGDCA, Core Java, Tally Prime)',
      validation: (Rule: any) => Rule.required().error('Course name is required'),
    },
    {
      name: 'issueDate',
      title: 'Date of Issue',
      type: 'date',
      description: 'Date certificate was issued to student',
      options: {
        dateFormat: 'YYYY-MM-DD',
      },
      validation: (Rule: any) => Rule.required().error('Issue date is required'),
    },
    {
      name: 'issuedBy',
      title: 'Issued By Institute Name',
      type: 'string',
      initialValue: 'BDPS Computer Education',
      description: 'Name of the issuing campus / institute',
    },
    {
      name: 'grade',
      title: 'Grade / Performance / Result',
      type: 'string',
      initialValue: 'Grade A+',
      description: 'Optional performance grade (e.g. Grade A+, Distinction, Excellent)',
    },
    {
      name: 'duration',
      title: 'Course Duration',
      type: 'string',
      initialValue: '6 Months',
      description: 'Optional course duration (e.g. 1 Year, 6 Months, 3 Months)',
    },
    {
      name: 'certificateId',
      title: 'Certificate ID / Serial No',
      type: 'string',
      description: 'Optional unique certificate serial number',
    },
    {
      name: 'status',
      title: 'Certificate Status',
      type: 'string',
      options: {
        list: [
          { title: 'Valid / Active', value: 'Valid' },
          { title: 'Revoked / Withheld', value: 'Revoked' },
        ],
        layout: 'radio',
      },
      initialValue: 'Valid',
    },
  ],
  preview: {
    select: {
      title: 'fullName',
      subtitle: 'regNumber',
      description: 'courseName',
    },
    prepare(selection: any) {
      const { title, subtitle, description } = selection;
      return {
        title: title || 'Untitled Student',
        subtitle: `REG: ${subtitle || 'N/A'} | ${description || 'Course'}`,
      };
    },
  },
};
