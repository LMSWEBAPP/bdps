export const popupAdSchema = {
  name: 'popupAd',
  title: 'Popup Advertisement',
  type: 'document',
  fields: [
    { name: 'title', title: 'Ad Title / Headline', type: 'string', validation: (Rule: any) => Rule.required() },
    { name: 'isActive', title: 'Enable Popup Ad on Website', type: 'boolean', initialValue: false },
    { name: 'bannerImage', title: 'Ad Banner Image', type: 'image', options: { hotspot: true } },
    { name: 'targetUrl', title: 'Click Redirect URL (optional)', type: 'url' },
    { name: 'buttonText', title: 'Call to Action Button Text', type: 'string', initialValue: 'Learn More' },
  ],
};
