import axios, { AxiosResponse } from 'axios';
import {
  Event,
  Article,
  Registration,
  Testimonial,
  NewsletterSubscriber,
  ApiResponse,
  AuthResponse,
  EventFilters,
  EventFormData,
  ArticleFormData,
  RegistrationFormData,
  TestimonialFormData,
  NewsletterFormData,
  DashboardStats
} from '../types';

// Configurare axios
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor pentru adăugarea token-ului de autentificare
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor pentru gestionarea răspunsurilor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirat sau invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Servicii pentru autentificare
export const authAPI = {
  login: async (email: string, parola: string): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await api.post('/auth/login', {
      email,
      parola,
    });
    return response.data;
  },

  register: async (nume: string, email: string, parola: string, telefon?: string): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await api.post('/auth/register', {
      nume,
      email,
      parola,
      telefon,
    });
    return response.data;
  },
};

// Servicii pentru evenimente
export const eventsAPI = {
  getAll: async (filters: EventFilters = {}): Promise<ApiResponse<Event[]>> => {
    const response: AxiosResponse<ApiResponse<Event[]>> = await api.get('/events', {
      params: filters,
    });
    return response.data;
  },

  getPopular: async (): Promise<ApiResponse<Event[]>> => {
    const response: AxiosResponse<ApiResponse<Event[]>> = await api.get('/events/popular');
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<Event>> => {
    const response: AxiosResponse<ApiResponse<Event>> = await api.get(`/events/${id}`);
    return response.data;
  },

  create: async (eventData: EventFormData): Promise<ApiResponse<Event>> => {
    const formData = new FormData();
    Object.entries(eventData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    const response: AxiosResponse<ApiResponse<Event>> = await api.post('/events', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  update: async (id: number, eventData: EventFormData): Promise<ApiResponse<Event>> => {
    const formData = new FormData();
    Object.entries(eventData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    const response: AxiosResponse<ApiResponse<Event>> = await api.put(`/events/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    const response: AxiosResponse<ApiResponse<void>> = await api.delete(`/events/${id}`);
    return response.data;
  },

  incrementClicks: async (id: number): Promise<ApiResponse<void>> => {
    const response: AxiosResponse<ApiResponse<void>> = await api.post(`/events/${id}/click`);
    return response.data;
  },
};

// Servicii pentru înregistrări
export const registrationsAPI = {
  register: async (eventId: number, data: RegistrationFormData): Promise<ApiResponse<Registration>> => {
    const response: AxiosResponse<ApiResponse<Registration>> = await api.post(
      `/registrations/events/${eventId}/register`,
      data
    );
    return response.data;
  },

  getAll: async (page = 1, limit = 20): Promise<ApiResponse<Registration[]>> => {
    const response: AxiosResponse<ApiResponse<Registration[]>> = await api.get('/registrations', {
      params: { page, limit },
    });
    return response.data;
  },

  getByEvent: async (eventId: number): Promise<ApiResponse<Registration[]>> => {
    const response: AxiosResponse<ApiResponse<Registration[]>> = await api.get(
      `/registrations/events/${eventId}`
    );
    return response.data;
  },

  updateStatus: async (id: number, status: string): Promise<ApiResponse<void>> => {
    const response: AxiosResponse<ApiResponse<void>> = await api.put(`/registrations/${id}/status`, {
      status_plata: status,
    });
    return response.data;
  },
};

// Servicii pentru blog
export const blogAPI = {
  getAll: async (page = 1, limit = 10): Promise<ApiResponse<Article[]>> => {
    const response: AxiosResponse<ApiResponse<Article[]>> = await api.get('/blog', {
      params: { page, limit },
    });
    return response.data;
  },

  getLatest: async (limit = 3): Promise<ApiResponse<Article[]>> => {
    const response: AxiosResponse<ApiResponse<Article[]>> = await api.get('/blog/latest', {
      params: { limit },
    });
    return response.data;
  },

  getById: async (id: number): Promise<ApiResponse<Article>> => {
    const response: AxiosResponse<ApiResponse<Article>> = await api.get(`/blog/${id}`);
    return response.data;
  },

  create: async (articleData: ArticleFormData): Promise<ApiResponse<Article>> => {
    const formData = new FormData();
    Object.entries(articleData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    const response: AxiosResponse<ApiResponse<Article>> = await api.post('/blog', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  update: async (id: number, articleData: ArticleFormData): Promise<ApiResponse<Article>> => {
    const formData = new FormData();
    Object.entries(articleData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    const response: AxiosResponse<ApiResponse<Article>> = await api.put(`/blog/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    const response: AxiosResponse<ApiResponse<void>> = await api.delete(`/blog/${id}`);
    return response.data;
  },
};

// Servicii pentru newsletter
export const newsletterAPI = {
  subscribe: async (data: NewsletterFormData): Promise<ApiResponse<void>> => {
    const response: AxiosResponse<ApiResponse<void>> = await api.post('/newsletter/subscribe', data);
    return response.data;
  },

  unsubscribe: async (email: string): Promise<ApiResponse<void>> => {
    const response: AxiosResponse<ApiResponse<void>> = await api.post('/newsletter/unsubscribe', {
      email,
    });
    return response.data;
  },

  getSubscribers: async (page = 1, limit = 50): Promise<ApiResponse<NewsletterSubscriber[]>> => {
    const response: AxiosResponse<ApiResponse<NewsletterSubscriber[]>> = await api.get(
      '/newsletter/subscribers',
      {
        params: { page, limit },
      }
    );
    return response.data;
  },

  sendNewsletter: async (subject: string, content: string, html_content?: string): Promise<ApiResponse<any>> => {
    const response: AxiosResponse<ApiResponse<any>> = await api.post('/newsletter/send', {
      subject,
      content,
      html_content,
    });
    return response.data;
  },
};

// Servicii pentru testimoniale
export const testimonialsAPI = {
  getApproved: async (limit = 10, eventId?: number): Promise<ApiResponse<Testimonial[]>> => {
    const params: any = { limit };
    if (eventId) params.id_eveniment = eventId;

    const response: AxiosResponse<ApiResponse<Testimonial[]>> = await api.get('/testimonials', {
      params,
    });
    return response.data;
  },

  getAll: async (page = 1, limit = 20, status?: string): Promise<ApiResponse<Testimonial[]>> => {
    const response: AxiosResponse<ApiResponse<Testimonial[]>> = await api.get('/testimonials/all', {
      params: { page, limit, status },
    });
    return response.data;
  },

  getByEvent: async (eventId: number, limit = 10): Promise<ApiResponse<Testimonial[]>> => {
    const response: AxiosResponse<ApiResponse<Testimonial[]>> = await api.get(
      `/testimonials/events/${eventId}`,
      {
        params: { limit },
      }
    );
    return response.data;
  },

  create: async (data: TestimonialFormData): Promise<ApiResponse<Testimonial>> => {
    const response: AxiosResponse<ApiResponse<Testimonial>> = await api.post('/testimonials', data);
    return response.data;
  },

  updateStatus: async (id: number, status: string): Promise<ApiResponse<void>> => {
    const response: AxiosResponse<ApiResponse<void>> = await api.put(`/testimonials/${id}/status`, {
      status,
    });
    return response.data;
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    const response: AxiosResponse<ApiResponse<void>> = await api.delete(`/testimonials/${id}`);
    return response.data;
  },

  getStats: async (): Promise<ApiResponse<any>> => {
    const response: AxiosResponse<ApiResponse<any>> = await api.get('/testimonials/stats');
    return response.data;
  },
};

// Servicii pentru verificarea stării serverului
export const healthAPI = {
  check: async (): Promise<ApiResponse<any>> => {
    const response: AxiosResponse<ApiResponse<any>> = await api.get('/health');
    return response.data;
  },
};

export default api;