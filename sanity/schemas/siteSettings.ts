export const siteSettingsSchema = {
  name: 'siteSettings',
  title: 'Site Settings & Announcements',
  type: 'document',
  fields: [
    { name: 'announcementBanner', title: 'Top Announcement Text', type: 'string' },
    { name: 'stipendRegistrationActive', title: 'Enable Stipend Registration Form', type: 'boolean', initialValue: true },
    { name: 'stipendNoticeText', title: 'Stipend Closed Notice Message', type: 'text', initialValue: 'Stipend registrations for the current batch are now closed. Please check back for upcoming cohort announcements.' },
    { name: 'contactEmail', title: 'Institute Support Email', type: 'string' },
    { name: 'contactPhone', title: 'Institute Support Phone', type: 'string' },
  ],
};
