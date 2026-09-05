// Google Analytics GA4 helper for Next.js

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

// Track custom pageviews
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag && GA_MEASUREMENT_ID) {
    (window as any).gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

// Track specific event (e.g. generate_lead)
export const trackEvent = (action: string, params: Record<string, any> = {}) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, params);
  }
};

// Track lead conversion event specifically as requested by GA
export const trackLeadEvent = (leadType: string = 'contact_form', details: Record<string, any> = {}) => {
  trackEvent('generate_lead', {
    event_category: 'lead_generation',
    event_label: leadType,
    value: 1,
    ...details,
  });
};
