import { Timestamp } from 'firebase/firestore';

// User Types
export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  phoneNumber?: string;
  role: 'user' | 'organizer' | 'admin';
  createdAt: Timestamp;
  updatedAt: Timestamp;
  preferences?: {
    language: 'ro' | 'en' | 'it';
    notifications: boolean;
    categories: EventCategory[];
  };
  paymentMethods?: PaymentMethod[];
}

// Event Types
export interface Event {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  category: EventCategory;
  subcategory?: string;
  organizerId: string;
  organizerName: string;
  organizerEmail: string;
  organizerWebsite?: string;
  startDate: Timestamp;
  endDate?: Timestamp;
  location: EventLocation;
  images: string[];
  videos?: string[];
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'cancelled' | 'completed';
  ticketTypes: TicketType[];
  totalTickets: number;
  soldTickets: number;
  revenue: number;
  tags?: string[];
  featured: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  promotions?: Promotion[];
  seatMap?: SeatMap;
  ageRestriction?: string;
  dresscode?: string;
  additionalInfo?: string;
}

export type EventCategory = 
  | 'music'
  | 'theater'
  | 'film'
  | 'sports'
  | 'conferences'
  | 'exhibitions'
  | 'parties'
  | 'family'
  | 'outdoor'
  | 'cultural';

export interface EventLocation {
  name: string;
  address: string;
  city: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  venue?: {
    capacity: number;
    type: 'indoor' | 'outdoor' | 'mixed';
    facilities: string[];
  };
}

// Ticket Types
export interface TicketType {
  id: string;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  quantity: number;
  sold: number;
  type: 'standard' | 'early-bird' | 'vip' | 'invitation' | 'day-pass' | 'season-pass';
  validDays?: string[]; // For multi-day events
  benefits?: string[];
  salesStart?: Timestamp;
  salesEnd?: Timestamp;
  transferable: boolean;
  refundable: boolean;
  customName?: string; // For invitations like "Invitație media nr 20"
}

// Seat Selection
export interface SeatMap {
  id: string;
  name: string;
  sections: SeatSection[];
  layout: 'theater' | 'stadium' | 'conference' | 'custom';
}

export interface SeatSection {
  id: string;
  name: string;
  price: number;
  seats: Seat[];
  color: string;
}

export interface Seat {
  id: string;
  row: string;
  number: string;
  status: 'available' | 'selected' | 'reserved' | 'sold';
  price?: number;
}

// Ticket and Order Types
export interface Ticket {
  id: string;
  eventId: string;
  eventTitle: string;
  userId: string;
  userName: string;
  userEmail: string;
  ticketTypeId: string;
  ticketTypeName: string;
  price: number;
  quantity: number;
  totalAmount: number;
  qrCode: string;
  status: 'active' | 'used' | 'cancelled' | 'refunded';
  purchaseDate: Timestamp;
  usedDate?: Timestamp;
  seatInfo?: {
    section: string;
    row: string;
    seat: string;
  };
  transferHistory?: TicketTransfer[];
}

export interface TicketTransfer {
  fromUserId: string;
  toUserId: string;
  transferDate: Timestamp;
  reason?: string;
}

export interface Order {
  id: string;
  userId: string;
  eventId: string;
  tickets: Ticket[];
  totalAmount: number;
  commission: number;
  vat: number;
  finalAmount: number;
  paymentIntentId: string;
  paymentStatus: 'pending' | 'succeeded' | 'failed' | 'cancelled' | 'refunded';
  paymentMethod: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  billingAddress?: Address;
  invoiceUrl?: string;
}

export interface Address {
  name: string;
  email: string;
  phone?: string;
  street: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  company?: string;
  vatNumber?: string;
}

// Payment Types
export interface PaymentMethod {
  id: string;
  type: 'card' | 'apple-pay' | 'google-pay';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

// Promotion Types
export interface Promotion {
  id: string;
  type: 'social-media' | 'banner' | 'video' | 'article' | 'website-link';
  title: string;
  description?: string;
  content?: string;
  url?: string;
  images?: string[];
  videos?: string[];
  price: number;
  vat: number;
  totalPrice: number;
  duration?: number; // in days
  status: 'draft' | 'pending' | 'active' | 'expired' | 'cancelled';
  createdAt: Timestamp;
  updatedAt: Timestamp;
  analytics?: {
    views: number;
    clicks: number;
    conversions: number;
  };
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: 'order-confirmation' | 'event-reminder' | 'event-update' | 'promotion';
  title: string;
  message: string;
  read: boolean;
  createdAt: Timestamp;
  data?: any;
}

// Analytics Types
export interface EventAnalytics {
  eventId: string;
  views: number;
  uniqueViews: number;
  ticketsSold: number;
  revenue: number;
  conversionRate: number;
  topReferrers: string[];
  demographicData: {
    ageGroups: Record<string, number>;
    locations: Record<string, number>;
    devices: Record<string, number>;
  };
  dailyStats: Array<{
    date: string;
    views: number;
    sales: number;
    revenue: number;
  }>;
}

// Search and Filter Types
export interface SearchFilters {
  query?: string;
  category?: EventCategory;
  location?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  priceRange?: {
    min: number;
    max: number;
  };
  tags?: string[];
  sortBy?: 'date' | 'price' | 'popularity' | 'created';
  sortOrder?: 'asc' | 'desc';
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Form Types
export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface EventForm {
  title: string;
  description: string;
  category: EventCategory;
  startDate: Date;
  endDate?: Date;
  location: Partial<EventLocation>;
  images: File[];
  ticketTypes: Partial<TicketType>[];
}

// Component Props Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;