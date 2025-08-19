// Tipuri pentru evenimente
export interface Event {
  id: number;
  titlu: string;
  descriere: string;
  descriere_scurta?: string;
  categorie: string;
  data_start: string;
  data_final?: string;
  ora: string;
  locatie: string;
  pret: number;
  capacitate?: number;
  status: 'viitor' | 'expirat';
  imagine_principala?: string;
  imagini?: string;
  video_url?: string;
  vizualizari: number;
  click_uri: number;
  data_creare: string;
  data_modificare: string;
}

// Tipuri pentru utilizatori
export interface User {
  id: number;
  nume: string;
  email: string;
  telefon?: string;
  rol: 'admin' | 'client';
  data_creare: string;
}

// Tipuri pentru înregistrări
export interface Registration {
  id: number;
  id_eveniment: number;
  id_utilizator?: number;
  nume_participant: string;
  email_participant: string;
  telefon_participant?: string;
  status_plata: 'in_asteptare' | 'platit' | 'anulat' | 'gratuit';
  data_inscriere: string;
  titlu_eveniment?: string;
  suma?: number;
  status_plata_detalii?: string;
}

// Tipuri pentru articole
export interface Article {
  id: number;
  titlu: string;
  continut: string;
  rezumat?: string;
  imagine_principala?: string;
  imagini?: string;
  status: 'publicat' | 'draft' | 'arhivat';
  data_publicare: string;
  data_modificare: string;
}

// Tipuri pentru newsletter
export interface NewsletterSubscriber {
  id: number;
  email: string;
  nume?: string;
  activ: boolean;
  data_abonare: string;
}

// Tipuri pentru testimoniale
export interface Testimonial {
  id: number;
  nume: string;
  email?: string;
  mesaj: string;
  rating: number;
  id_eveniment?: number;
  titlu_eveniment?: string;
  status: 'in_asteptare' | 'aprobat' | 'respins';
  data_creare: string;
}

// Tipuri pentru plăți
export interface Payment {
  id: number;
  id_inscriere: number;
  metoda_plata: string;
  suma: number;
  moneda: string;
  id_tranzactie?: string;
  status: 'in_asteptare' | 'platit' | 'esuat' | 'anulat';
  data_plata: string;
}

// Tipuri pentru filtre și paginare
export interface EventFilters {
  categorie?: string;
  locatie?: string;
  data_start?: string;
  data_final?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalEvents?: number;
  totalArticles?: number;
  totalRegistrations?: number;
  totalSubscribers?: number;
  totalTestimonials?: number;
  hasNext?: boolean;
  hasPrev?: boolean;
}

// Tipuri pentru răspunsurile API
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  pagination?: Pagination;
  errors?: any[];
}

// Tipuri pentru autentificare
export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

// Tipuri pentru formulare
export interface EventFormData {
  titlu: string;
  descriere: string;
  descriere_scurta?: string;
  categorie: string;
  data_start: string;
  data_final?: string;
  ora: string;
  locatie: string;
  pret?: number;
  capacitate?: number;
  imagine?: File;
}

export interface RegistrationFormData {
  nume_participant: string;
  email_participant: string;
  telefon_participant?: string;
}

export interface ArticleFormData {
  titlu: string;
  continut: string;
  rezumat?: string;
  status?: string;
  imagine?: File;
}

export interface TestimonialFormData {
  nume: string;
  email?: string;
  mesaj: string;
  rating?: number;
  id_eveniment?: number;
}

export interface NewsletterFormData {
  email: string;
  nume?: string;
}

// Tipuri pentru statistici
export interface DashboardStats {
  totalEvents: number;
  upcomingEvents: number;
  totalRegistrations: number;
  totalSubscribers: number;
  totalTestimonials: number;
  approvedTestimonials: number;
  pendingTestimonials: number;
  averageRating: number;
}

// Tipuri pentru categorii
export type EventCategory = 
  | 'conferinta'
  | 'workshop'
  | 'seminar'
  | 'networking'
  | 'concert'
  | 'teatru'
  | 'expozitie'
  | 'sport'
  | 'caritabil'
  | 'altele';

// Tipuri pentru statusuri
export type EventStatus = 'viitor' | 'expirat';
export type PaymentStatus = 'in_asteptare' | 'platit' | 'esuat' | 'anulat';
export type RegistrationStatus = 'in_asteptare' | 'platit' | 'anulat' | 'gratuit';
export type TestimonialStatus = 'in_asteptare' | 'aprobat' | 'respins';
export type ArticleStatus = 'publicat' | 'draft' | 'arhivat';