// Funcții utile pentru formatarea datelor și alte operații

// Formatează data în format românesc
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ro-RO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

// Formatează data și ora în format românesc
export const formatDateTime = (dateString: string, timeString?: string): string => {
  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString('ro-RO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  
  if (timeString) {
    return `${formattedDate} la ${timeString}`;
  }
  
  return formattedDate;
};

// Formatează ora
export const formatTime = (timeString: string): string => {
  const [hours, minutes] = timeString.split(':');
  return `${hours}:${minutes}`;
};

// Formatează prețul
export const formatPrice = (price: number): string => {
  if (price === 0) {
    return 'Gratuit';
  }
  
  return `${price.toLocaleString('ro-RO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })} RON`;
};

// Formatează numărul de participanți
export const formatParticipants = (count: number, capacity?: number): string => {
  if (capacity) {
    return `${count}/${capacity} participanți`;
  }
  return `${count} participanți`;
};

// Calculează numărul de zile până la eveniment
export const getDaysUntilEvent = (eventDate: string): number => {
  const today = new Date();
  const event = new Date(eventDate);
  const diffTime = event.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Verifică dacă evenimentul este în curând (în următoarele 7 zile)
export const isEventSoon = (eventDate: string): boolean => {
  const daysUntil = getDaysUntilEvent(eventDate);
  return daysUntil >= 0 && daysUntil <= 7;
};

// Verifică dacă evenimentul a expirat
export const isEventExpired = (eventDate: string): boolean => {
  return getDaysUntilEvent(eventDate) < 0;
};

// Formatează textul pentru SEO (slug)
export const createSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/ă/g, 'a')
    .replace(/â/g, 'a')
    .replace(/î/g, 'i')
    .replace(/ș/g, 's')
    .replace(/ț/g, 't')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
};

// Validează adresa de email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validează numărul de telefon românesc
export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^(\+40|0040|0)[27][0-9]{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Formatează numărul de telefon
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.startsWith('40')) {
    return `+${cleaned}`;
  } else if (cleaned.startsWith('0')) {
    return `+4${cleaned}`;
  }
  
  return phone;
};

// Truncate text
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  
  return text.substring(0, maxLength).trim() + '...';
};

// Calculează timpul de citire estimat pentru un articol
export const calculateReadingTime = (text: string): number => {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  const readingTime = Math.ceil(words / wordsPerMinute);
  return Math.max(1, readingTime);
};

// Generează o culoare aleatorie pentru avatar-uri
export const generateAvatarColor = (name: string): string => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};

// Obține inițialele numelui pentru avatar
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

// Formatează rating-ul cu stele
export const formatRating = (rating: number): string => {
  const stars = '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  return `${stars} (${rating.toFixed(1)})`;
};

// Convertește bytes în format citibil
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Debounce pentru search
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Scroll smooth la un element
export const scrollToElement = (elementId: string, offset = 0): void => {
  const element = document.getElementById(elementId);
  if (element) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};

// Verifică dacă device-ul este mobil
export const isMobile = (): boolean => {
  return window.innerWidth <= 768;
};

// Verifică dacă device-ul este tablet
export const isTablet = (): boolean => {
  return window.innerWidth > 768 && window.innerWidth <= 1024;
};

// Verifică dacă device-ul este desktop
export const isDesktop = (): boolean => {
  return window.innerWidth > 1024;
};

// Copiază text în clipboard
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback pentru browsere mai vechi
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (err) {
      document.body.removeChild(textArea);
      return false;
    }
  }
};

// Generează un ID unic
export const generateUniqueId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Formatează statusul pentru afișare
export const formatStatus = (status: string): string => {
  const statusMap: { [key: string]: string } = {
    'viitor': 'Viitor',
    'expirat': 'Expirat',
    'in_asteptare': 'În așteptare',
    'platit': 'Plătit',
    'anulat': 'Anulat',
    'gratuit': 'Gratuit',
    'aprobat': 'Aprobat',
    'respins': 'Respins',
    'publicat': 'Publicat',
    'draft': 'Ciornă',
    'arhivat': 'Arhivat',
  };
  
  return statusMap[status] || status;
};

// Obține culoarea pentru status
export const getStatusColor = (status: string): string => {
  const colorMap: { [key: string]: string } = {
    'viitor': '#4CAF50',
    'expirat': '#9E9E9E',
    'in_asteptare': '#FF9800',
    'platit': '#4CAF50',
    'anulat': '#F44336',
    'gratuit': '#2196F3',
    'aprobat': '#4CAF50',
    'respins': '#F44336',
    'publicat': '#4CAF50',
    'draft': '#FF9800',
    'arhivat': '#9E9E9E',
  };
  
  return colorMap[status] || '#9E9E9E';
};