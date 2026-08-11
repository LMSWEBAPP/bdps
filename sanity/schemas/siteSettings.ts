export const siteSettingsSchema = {
  name: 'siteSettings',
  title: 'Site Settings & Announcements',
  type: 'document',
  fieldsets: [
    { name: 'contact', title: '📞 Contact & Address Details', options: { collapsible: true, collapsed: false } },
    { name: 'social', title: '🌐 Social Media Handles', options: { collapsible: true, collapsed: false } },
    { name: 'internship', title: '💼 Internship Program (On/Off Toggle)', options: { collapsible: true, collapsed: false } },
    { name: 'stipend', title: '🎓 Stipend & Scholarship (On/Off Toggle)', options: { collapsible: true, collapsed: false } },
  ],
  fields: [
    { 
      name: 'announcementBanner', 
      title: 'Top Announcement Banner Text', 
      type: 'string',
      description: 'Optional top announcement banner shown at the very top of the visitor website.' 
    },
    // Contact Info
    { 
      name: 'contactPhone', 
      title: 'Institute Contact Mobile / Phone', 
      type: 'string', 
      fieldset: 'contact',
      initialValue: '+91 85001 08016',
      description: 'Main mobile number displayed in Header, Footer, and Contact page.' 
    },
    { 
      name: 'contactEmail', 
      title: 'Institute Support Email', 
      type: 'string', 
      fieldset: 'contact',
      initialValue: 'bdpskkd@gmail.com',
      description: 'Official email address displayed in Header, Footer, and Contact page.' 
    },
    { 
      name: 'whatsappNumber', 
      title: 'WhatsApp Contact Number', 
      type: 'string', 
      fieldset: 'contact',
      initialValue: '+91 85001 08016',
      description: 'WhatsApp number for instant student chat inquiries.' 
    },
    { 
      name: 'address', 
      title: 'HQ Campus Address', 
      type: 'text', 
      fieldset: 'contact',
      initialValue: 'Flat No. 1, Sai Prameela Apartment, B-Block, Backside Ulavacharu Restaurant, Nagamallithota Junction, Pithapuram Road, Kakinada - 533003',
      description: 'Physical campus address shown on the website footer and contact page.' 
    },
    // Social Handles
    { 
      name: 'facebook', 
      title: 'Facebook Page URL', 
      type: 'url', 
      fieldset: 'social',
      description: 'e.g. https://facebook.com/bdpscomputers' 
    },
    { 
      name: 'instagram', 
      title: 'Instagram Profile URL', 
      type: 'url', 
      fieldset: 'social',
      description: 'e.g. https://instagram.com/bdpscomputers' 
    },
    { 
      name: 'linkedin', 
      title: 'LinkedIn Page / Profile URL', 
      type: 'url', 
      fieldset: 'social',
      description: 'e.g. https://linkedin.com/company/bdps' 
    },
    { 
      name: 'youtube', 
      title: 'YouTube Channel URL', 
      type: 'url', 
      fieldset: 'social',
      description: 'e.g. https://youtube.com/@bdpscomputers' 
    },
    { 
      name: 'twitter', 
      title: 'Twitter / X Profile URL', 
      type: 'url', 
      fieldset: 'social',
      description: 'e.g. https://twitter.com/bdpscomputers' 
    },
    // Internship Settings
    { 
      name: 'internshipActive', 
      title: 'Enable / Toggle Apply for Internship', 
      type: 'boolean', 
      fieldset: 'internship',
      initialValue: true,
      description: 'Turn ON to accept internship applications. When turned OFF, the button shows "CLOSED" and displays the custom notice message.' 
    },
    { 
      name: 'internshipNoticeText', 
      title: 'Internship Closed Notice Message', 
      type: 'text', 
      fieldset: 'internship',
      initialValue: 'Internship applications for the current batch are currently closed. Please check back for upcoming cohort announcements.',
      description: 'Message shown when visitors click the Internship button while applications are toggled OFF.' 
    },
    {
      name: 'internshipCourses',
      title: 'Custom Internship Domains / Courses',
      type: 'array',
      fieldset: 'internship',
      of: [{ type: 'string' }],
      description: 'List of internship streams (e.g. Python Full Stack, Core Java, Web Development, Tally Prime). If empty, defaults to standard courses.',
    },
    // Stipend Settings
    { 
      name: 'stipendRegistrationActive', 
      title: 'Enable Stipend & Scholarship Registration', 
      type: 'boolean', 
      fieldset: 'stipend',
      initialValue: true,
      description: 'Turn ON to show and accept Stipend applications.' 
    },
    { 
      name: 'stipendNoticeText', 
      title: 'Stipend Closed Notice Message', 
      type: 'text', 
      fieldset: 'stipend',
      initialValue: 'Stipend registrations for the current batch are now closed. Please check back for upcoming cohort announcements.' 
    },
  ],
};
