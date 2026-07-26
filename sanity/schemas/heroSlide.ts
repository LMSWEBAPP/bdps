export const heroSlideSchema = {
  name: 'heroSlide',
  title: 'Homepage Hero Banner Slides',
  type: 'document',
  fields: [
    { name: 'title', title: 'Main Heading Title', type: 'string', validation: (Rule: any) => Rule.required() },
    { name: 'subtitle', title: 'Top Tagline / Subtitle', type: 'string' },
    { name: 'description', title: 'Description Paragraph', type: 'text', rows: 3 },
    { name: 'slideImage', title: 'Right Side Slide Card Image', type: 'image', options: { hotspot: true } },
    {
      name: 'backgroundPreset',
      title: 'Background Color / Gradient Preset',
      type: 'string',
      options: {
        list: [
          { title: 'BDPS Signature Orange Gradient', value: 'linear-gradient(135deg, #BD601C 0%, #7A3700 100%)' },
          { title: 'Warm Amber Gold', value: 'linear-gradient(135deg, #B45309 0%, #92400E 100%)' },
          { title: 'Dark Charcoal Navy', value: 'linear-gradient(135deg, #2D3748 0%, #1A202C 100%)' },
          { title: 'Deep Royal Blue', value: 'linear-gradient(135deg, #0A2A73 0%, #061A47 100%)' },
          { title: 'Forest Emerald Green', value: 'linear-gradient(135deg, #047857 0%, #064E3B 100%)' },
          { title: 'Custom CSS Gradient / Color (Set Below)', value: 'custom' }
        ]
      },
      initialValue: 'linear-gradient(135deg, #BD601C 0%, #7A3700 100%)'
    },
    { 
      name: 'customBackground', 
      title: 'Custom Background CSS (if preset is set to Custom)', 
      type: 'string', 
      description: 'e.g. #7A3700 or linear-gradient(135deg, #BD601C 0%, #0A2A73 100%)' 
    },
    { 
      name: 'backgroundImage', 
      title: 'Full Background Banner Image (Optional)', 
      type: 'image', 
      options: { hotspot: true },
      description: 'Optional background cover image for the hero slide banner' 
    },
    { name: 'buttonText', title: 'Primary Button Text', type: 'string', initialValue: 'Explore Courses' },
    { name: 'buttonLink', title: 'Primary Button Link', type: 'string', initialValue: '/courses' },
    { name: 'secondaryButtonText', title: 'Secondary Button Text', type: 'string', initialValue: 'Get Counseling' },
    { name: 'secondaryButtonLink', title: 'Secondary Button Link', type: 'string', initialValue: '/contact' },
    { name: 'order', title: 'Display Order (1, 2, 3...)', type: 'number', initialValue: 1 },
  ],
};
