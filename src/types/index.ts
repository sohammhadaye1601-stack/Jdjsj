export interface BusinessInfo {
  name: string;
  category: string;
  tagline: string;
  managedBy: string;
  instagramHandle: string;
  instagramUrl: string;
  phoneNumbers: string[];
  email: string;
  address: string;
  googleMapsEmbedUrl: string;
  googleMapsDirectionsUrl: string;
  openingHours: string;
}

export interface StatItem {
  label: string;
  value: string;
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface ProgramItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  benefits: string[];
  image: string;
  badge?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Interiors' | 'Workout' | 'Weight Training' | 'Personal Training' | 'Equipment' | 'Transformations';
  imageUrl: string;
  caption?: string;
  order: number;
}

export interface TrainerItem {
  id: string;
  name: string;
  specialization: string;
  experience: string;
  bio: string;
  image: string;
  certifications: string[];
  instagram?: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  duration: string;
  price: string;
  originalPrice?: string;
  popular: boolean;
  badge?: string;
  features: string[];
  offerText?: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  rating: number;
  text: string;
  program: string;
  image: string;
  results?: string;
}

export interface WebsiteSettings {
  accentColor: string;
  primaryBg: string;
  secondaryBg: string;
  allowPublicEnquiries: boolean;
}

export interface SiteContent {
  businessInfo: BusinessInfo;
  hero: {
    mainHeading: string;
    subHeading: string;
    ctaPrimaryText: string;
    ctaSecondaryText: string;
    backgroundImage: string;
    stats: StatItem[];
  };
  about: {
    heading: string;
    subheading: string;
    intro: string;
    description: string;
    image: string;
    highlights: FeatureItem[];
    stats: StatItem[];
  };
  whyChooseUs: {
    heading: string;
    subheading: string;
    features: FeatureItem[];
  };
  programs: ProgramItem[];
  gallery: GalleryItem[];
  trainers: TrainerItem[];
  membershipPlans: MembershipPlan[];
  testimonials: TestimonialItem[];
  settings: WebsiteSettings;
}

export interface Enquiry {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  fitnessGoal: string;
  preferredProgram: string;
  message: string;
  status: 'new' | 'contacted' | 'enrolled' | 'archived';
  createdAt: string;
  notes?: string;
}
