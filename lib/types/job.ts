export interface JobPosting {
  _id: string;
  adzunaId?: string;
  isCustom?: boolean;
  title: string;
  company: string;
  location: string;
  category: string;
  description: string;
  salaryMin?: number | null;
  salaryMax?: number | null;
  redirectUrl?: string;
  postedAt?: string;
  syncedAt?: string;
  jobType?: string;
  experienceRequired?: string;
  requirements?: string[];
  responsibilities?: string[];
  skills?: string[];
  contactEmail?: string;
}

export interface JobLeadPayload {
  fullName: string;
  email: string;
  phone: string;
  jobTitle: string;
  company: string;
  qualification: string;
  experience: string;
  city: string;
  appliedJobUrl: string;
  notes?: string;
}
