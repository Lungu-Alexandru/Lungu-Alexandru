'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Star, 
  Share2, 
  Heart,
  ChevronLeft,
  ChevronRight,
  Ticket,
  Info,
  Shield,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { useAuth } from '@/contexts/AuthContext';
import { formatDate, formatPrice, translateCategory } from '@/lib/utils';
import toast from 'react-hot-toast';

// Mock event data
const mockEvent = {
  id: '1',
  title: 'Concert Delia - Turneu Național 2024',
  description: `Delia revine cu un turneu spectaculos care promite să fie unul dintre cele mai mari evenimente muzicale ale anului. Artista va interpreta atât hit-urile consacrate, cât și piesele de pe noul album.

Concertul va fi o experiență audiovisuală de neuitat, cu efecte speciale, coregrafie spectaculoasă și surprize pentru fani. Delia va fi însoțită de o trupă de muzicieni profesioniști și dansatori.

Nu ratați această oportunitate unică de a trăi o seară magică alături de una dintre cele mai iubite artiste din România!`,
  shortDescription: 'Delia revine cu un turneu spectaculos care promite să fie unul dintre cele mai mari evenimente muzicale ale anului.',
  category: 'music' as const,
  startDate: new Date('2024-02-15T20:00:00'),
  endDate: new Date('2024-02-15T23:00:00'),
  location: {
    name: 'Sala Palatului',
    address: 'Bulevardul Ion C. Brătianu 1',
    city: 'București',
    country: 'România',
    coordinates: { lat: 44.4268, lng: 26.1025 },
    venue: {
      capacity: 4000,
      type: 'indoor' as const,
      facilities: ['Parcare', 'Bar', 'Garderobă', 'Acces persoane cu dizabilități']
    }
  },
  images: [
    'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1200',
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200',
    'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200'
  ],
  videos: ['https://www.youtube.com/embed/dQw4w9WgXcQ'],
  organizerId: 'org1',
  organizerName: 'Music Events Pro',
  organizerEmail: 'contact@musiceventspro.ro',
  organizerWebsite: 'https://musiceventspro.ro',
  ticketTypes: [
    {
      id: '1',
      name: 'Early Bird',
      description: 'Bilet cu reducere pentru cumpărătorii timpurii',
      price: 100,
      originalPrice: 120,
      discountPercentage: 17,
      quantity: 500,
      sold: 480,
      type: 'early-bird' as const,
      benefits: ['Acces prioritar', 'Reducere la bar'],
      salesEnd: new Date('2024-01-15T23:59:59'),
      transferable: true,
      refundable: false
    },
    {
      id: '2',
      name: 'Standard',
      description: 'Bilet standard cu acces la eveniment',
      price: 120,
      quantity: 2500,
      sold: 1800,
      type: 'standard' as const,
      benefits: ['Acces la eveniment'],
      transferable: true,
      refundable: true
    },
    {
      id: '3',
      name: 'VIP Experience',
      description: 'Experiența completă VIP cu avantaje exclusive',
      price: 300,
      quantity: 200,
      sold: 150,
      type: 'vip' as const,
      benefits: [
        'Acces VIP la eveniment',
        'Meet & Greet cu artista',
        'Poză cu autograf',
        'Băuturi incluse',
        'Parcare gratuită',
        'Acces la afterparty'
      ],
      transferable: false,
      refundable: true
    }
  ],
  totalTickets: 3200,
  soldTickets: 2430,
  featured: true,
  status: 'approved' as const,
  tags: ['pop', 'concert', 'live', 'turneu'],
  ageRestriction: '12+',
  dresscode: 'Smart casual',
  additionalInfo: 'Se recomandă sosirea cu 30 de minute înainte de începerea evenimentului.',
  rating: 4.8,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-10')
};

const similarEvents = [
  {
    id: '2',
    title: 'Inna Live Concert',
    category: 'music',
    date: new Date('2024-03-10T21:00:00'),
    location: 'Romexpo, București',
    price: 150,
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400'
  },
  {
    id: '3',
    title: 'Smiley - Acasă Concert',
    category: 'music',
    date: new Date('2024-03-20T20:00:00'),
    location: 'Sala Polivalentă, Cluj-Napoca',
    price: 90,
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400'
  }
];

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { currentUser } = useAuth();
  const [event] = useState(mockEvent); // In real app, fetch by params.id
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [selectedTicketType, setSelectedTicketType] = useState<string>('');
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % event.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + event.images.length) % event.images.length);
  };

  const handleTicketPurchase = () => {
    if (!currentUser) {
      router.push('/auth/login');
      return;
    }

    if (!selectedTicketType) {
      toast.error('Te rugăm să selectezi un tip de bilet');
      return;
    }

    // Redirect to checkout
    router.push(`/checkout?event=${event.id}&ticket=${selectedTicketType}&quantity=${ticketQuantity}`);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: event.shortDescription,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copiat în clipboard!');
    }
  };

  const toggleLike = () => {
    if (!currentUser) {
      router.push('/auth/login');
      return;
    }
    setIsLiked(!isLiked);
    toast.success(isLiked ? 'Eliminat din favorite' : 'Adăugat la favorite');
  };

  const availableTickets = event.ticketTypes.filter(ticket => ticket.sold < ticket.quantity);
  const isEventSoldOut = availableTickets.length === 0;
  const isEventPast = new Date(event.startDate) < new Date();

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <Link href="/events" className="text-primary-500 hover:text-primary-600 font-medium">
            ← Înapoi la evenimente
          </Link>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="relative">
              <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden">
                <Image
                  src={event.images[currentImageIndex]}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
                
                {/* Image Navigation */}
                {event.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
                    >
                      <ChevronLeft className="h-5 w-5 text-gray-800" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
                    >
                      <ChevronRight className="h-5 w-5 text-gray-800" />
                    </button>
                  </>
                )}

                {/* Image Indicators */}
                {event.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                    {event.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-200 ${
                          index === currentImageIndex ? 'bg-white scale-125' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button
                    onClick={toggleLike}
                    className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 ${
                      isLiked ? 'bg-red-500 text-white' : 'bg-white/80 hover:bg-white text-gray-800'
                    }`}
                  >
                    <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 text-gray-800"
                  >
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>

                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {translateCategory(event.category)}
                  </span>
                </div>
              </div>
            </div>

            {/* Event Info */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{event.rating}</span>
                    <span className="text-gray-500 text-sm">(248 recenzii)</span>
                  </div>
                  {event.featured && (
                    <span className="bg-accent-500 text-gray-900 px-2 py-1 rounded-full text-xs font-medium">
                      Recomandat
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Organizat de</p>
                  <p className="font-medium">{event.organizerName}</p>
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {event.title}
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-primary-500" />
                  <div>
                    <p className="font-medium">{formatDate(event.startDate, 'EEEE, dd MMMM yyyy')}</p>
                    <p className="text-sm text-gray-600">
                      {formatDate(event.startDate, 'HH:mm')} - {formatDate(event.endDate, 'HH:mm')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-primary-500" />
                  <div>
                    <p className="font-medium">{event.location.name}</p>
                    <p className="text-sm text-gray-600">{event.location.address}, {event.location.city}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-primary-500" />
                  <div>
                    <p className="font-medium">{event.soldTickets.toLocaleString()} participanți</p>
                    <p className="text-sm text-gray-600">din {event.totalTickets.toLocaleString()} locuri</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-primary-500" />
                  <div>
                    <p className="font-medium">3 ore</p>
                    <p className="text-sm text-gray-600">Durata evenimentului</p>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Bilete vândute</span>
                  <span>{Math.round((event.soldTickets / event.totalTickets) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary-500 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${(event.soldTickets / event.totalTickets) * 100}%` }}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="prose max-w-none">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Despre eveniment</h2>
                <div className="text-gray-600 whitespace-pre-line">
                  {event.description}
                </div>
              </div>

              {/* Additional Info */}
              {(event.ageRestriction || event.dresscode || event.additionalInfo) && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Info className="h-5 w-5" />
                      <span>Informații importante</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {event.ageRestriction && (
                      <p><strong>Restricție de vârstă:</strong> {event.ageRestriction}</p>
                    )}
                    {event.dresscode && (
                      <p><strong>Cod vestimentar:</strong> {event.dresscode}</p>
                    )}
                    {event.additionalInfo && (
                      <p><strong>Info suplimentare:</strong> {event.additionalInfo}</p>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Venue Facilities */}
              {event.location.venue?.facilities && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Facilități venue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {event.location.venue.facilities.map((facility, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                        >
                          {facility}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Map */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Locația evenimentului</span>
                    <a
                      href={`https://maps.google.com?q=${event.location.coordinates.lat},${event.location.coordinates.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-500 hover:text-primary-600 flex items-center space-x-1 text-sm"
                    >
                      <span>Deschide în Google Maps</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Google Maps va fi integrat aici</p>
                  </div>
                  <div className="mt-4">
                    <p className="font-medium">{event.location.name}</p>
                    <p className="text-gray-600">{event.location.address}</p>
                    <p className="text-gray-600">{event.location.city}, {event.location.country}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Ticket Purchase Card */}
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Cumpără bilete</span>
                  <Ticket className="h-5 w-5" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEventPast ? (
                  <div className="text-center py-4">
                    <p className="text-gray-500 mb-2">Acest eveniment s-a încheiat</p>
                    <Button disabled className="w-full">
                      Eveniment încheiat
                    </Button>
                  </div>
                ) : isEventSoldOut ? (
                  <div className="text-center py-4">
                    <p className="text-red-500 font-medium mb-2">Sold Out</p>
                    <Button disabled className="w-full">
                      Nu mai sunt bilete disponibile
                    </Button>
                  </div>
                ) : (
                  <>
                    {/* Ticket Types */}
                    <div className="space-y-3">
                      {availableTickets.map((ticket) => {
                        const remaining = ticket.quantity - ticket.sold;
                        const isLowStock = remaining <= 10;
                        
                        return (
                          <div
                            key={ticket.id}
                            className={`p-4 border rounded-lg cursor-pointer transition-all ${
                              selectedTicketType === ticket.id
                                ? 'border-primary-500 bg-primary-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => setSelectedTicketType(ticket.id)}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <h4 className="font-medium">{ticket.name}</h4>
                                {ticket.description && (
                                  <p className="text-sm text-gray-600">{ticket.description}</p>
                                )}
                              </div>
                              <div className="text-right">
                                {ticket.originalPrice && ticket.originalPrice > ticket.price ? (
                                  <>
                                    <p className="text-sm text-gray-400 line-through">
                                      {formatPrice(ticket.originalPrice)}
                                    </p>
                                    <p className="font-bold text-green-600">
                                      {formatPrice(ticket.price)}
                                    </p>
                                    <p className="text-xs text-green-600">
                                      -{ticket.discountPercentage}%
                                    </p>
                                  </>
                                ) : (
                                  <p className="font-bold">{formatPrice(ticket.price)}</p>
                                )}
                              </div>
                            </div>

                            {ticket.benefits && ticket.benefits.length > 0 && (
                              <div className="text-xs text-gray-600 mb-2">
                                {ticket.benefits.slice(0, 2).map((benefit, index) => (
                                  <div key={index}>• {benefit}</div>
                                ))}
                                {ticket.benefits.length > 2 && (
                                  <div>• +{ticket.benefits.length - 2} alte beneficii</div>
                                )}
                              </div>
                            )}

                            <div className="flex items-center justify-between text-sm">
                              <span className={`${isLowStock ? 'text-red-500' : 'text-gray-500'}`}>
                                {isLowStock ? `Doar ${remaining} rămas!` : `${remaining} disponibile`}
                              </span>
                              <div className="flex items-center space-x-1">
                                <Shield className="h-3 w-3 text-green-500" />
                                <span className="text-green-600">
                                  {ticket.refundable ? 'Returabil' : 'Non-returabil'}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Quantity Selector */}
                    {selectedTicketType && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Numărul de bilete
                        </label>
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))}
                            className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-medium">{ticketQuantity}</span>
                          <button
                            onClick={() => {
                              const maxQuantity = Math.min(
                                8,
                                availableTickets.find(t => t.id === selectedTicketType)?.quantity! - 
                                availableTickets.find(t => t.id === selectedTicketType)?.sold!
                              );
                              setTicketQuantity(Math.min(maxQuantity, ticketQuantity + 1));
                            }}
                            className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50"
                          >
                            +
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Maximum 8 bilete per comandă</p>
                      </div>
                    )}

                    {/* Total Price */}
                    {selectedTicketType && (
                      <div className="border-t pt-4">
                        <div className="flex items-center justify-between text-lg font-bold">
                          <span>Total:</span>
                          <span>
                            {formatPrice(
                              (availableTickets.find(t => t.id === selectedTicketType)?.price || 0) * ticketQuantity
                            )}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Taxele sunt incluse în preț
                        </p>
                      </div>
                    )}

                    {/* Purchase Button */}
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handleTicketPurchase}
                      disabled={!selectedTicketType || loading}
                      loading={loading}
                    >
                      {!currentUser ? 'Conectează-te pentru a cumpăra' : 'Cumpără bilete'}
                    </Button>

                    {/* Security Notice */}
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <Shield className="h-4 w-4" />
                      <span>Plată securizată prin Stripe</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Organizer Info */}
            <Card>
              <CardHeader>
                <CardTitle>Organizator</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium">{event.organizerName}</h4>
                    <p className="text-sm text-gray-600">{event.organizerEmail}</p>
                  </div>
                  
                  {event.organizerWebsite && (
                    <a
                      href={event.organizerWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-primary-500 hover:text-primary-600 text-sm"
                    >
                      <span>Vizitează site-ul</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  
                  <Button variant="outline" size="sm" className="w-full">
                    Vezi toate evenimentele
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Similar Events */}
            {similarEvents.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Evenimente similare</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {similarEvents.map((similarEvent) => (
                      <Link key={similarEvent.id} href={`/events/${similarEvent.id}`}>
                        <div className="flex space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                          <div className="w-16 h-16 relative flex-shrink-0">
                            <Image
                              src={similarEvent.image}
                              alt={similarEvent.title}
                              fill
                              className="object-cover rounded-lg"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-medium text-sm line-clamp-2">
                              {similarEvent.title}
                            </h5>
                            <p className="text-xs text-gray-500 mt-1">
                              {formatDate(similarEvent.date, 'dd MMM')} • {similarEvent.location}
                            </p>
                            <p className="text-sm font-medium text-primary-500 mt-1">
                              de la {formatPrice(similarEvent.price)}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}