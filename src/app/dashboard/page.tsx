'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  User, 
  Ticket, 
  Calendar, 
  Heart, 
  Settings,
  Bell,
  CreditCard,
  Download,
  Star,
  MapPin,
  Clock,
  TrendingUp,
  Eye,
  BarChart3
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { formatDate, formatPrice } from '@/lib/utils';

// Mock data for user dashboard
const mockUserStats = {
  totalTickets: 12,
  upcomingEvents: 3,
  favoriteEvents: 8,
  totalSpent: 1450
};

const mockUpcomingTickets = [
  {
    id: '1',
    eventId: '1',
    eventTitle: 'Concert Delia - Turneu Național 2024',
    eventImage: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400',
    ticketType: 'VIP Experience',
    quantity: 2,
    totalPrice: 600,
    qrCode: 'QR123456789',
    status: 'active',
    date: new Date('2024-02-15T20:00:00'),
    location: 'Sala Palatului, București',
    purchaseDate: new Date('2024-01-10'),
    seatInfo: { section: 'VIP', row: 'A', seat: '15-16' }
  },
  {
    id: '2',
    eventId: '2',
    eventTitle: 'Teatrul Național - Hamlet',
    eventImage: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=400',
    ticketType: 'Balcon',
    quantity: 1,
    totalPrice: 85,
    qrCode: 'QR987654321',
    status: 'active',
    date: new Date('2024-02-20T19:30:00'),
    location: 'Teatrul Național, București',
    purchaseDate: new Date('2024-01-15'),
    seatInfo: { section: 'Balcon', row: 'C', seat: '12' }
  }
];

const mockPastTickets = [
  {
    id: '3',
    eventId: '3',
    eventTitle: 'Concert Inna - New Year Party',
    eventImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
    ticketType: 'Standard',
    quantity: 2,
    totalPrice: 300,
    status: 'used',
    date: new Date('2023-12-31T22:00:00'),
    location: 'Romexpo, București',
    purchaseDate: new Date('2023-12-01'),
    rating: 5
  }
];

const mockFavoriteEvents = [
  {
    id: '4',
    title: 'Smiley - Acasă Concert',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400',
    date: new Date('2024-03-20T20:00:00'),
    location: 'Sala Polivalentă, Cluj-Napoca',
    price: 90,
    category: 'music'
  },
  {
    id: '5',
    title: 'Festivalul de Film Transilvania',
    image: 'https://images.unsplash.com/photo-1489599663391-a3e8d0b3d2b6?w=400',
    date: new Date('2024-05-15T18:00:00'),
    location: 'Cinema Florin Piersic, Cluj-Napoca',
    price: 45,
    category: 'film'
  }
];

export default function DashboardPage() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  if (!currentUser) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p>Te rugăm să te conectezi pentru a accesa dashboard-ul.</p>
            <Link href="/auth/login">
              <Button className="mt-4">Conectează-te</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Prezentare generală', icon: BarChart3 },
    { id: 'tickets', label: 'Biletele mele', icon: Ticket },
    { id: 'favorites', label: 'Favorite', icon: Heart },
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'settings', label: 'Setări', icon: Settings }
  ];

  const TicketCard = ({ ticket, isPast = false }: { ticket: any, isPast?: boolean }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex space-x-4">
          <div className="w-20 h-20 relative flex-shrink-0">
            <Image
              src={ticket.eventImage}
              alt={ticket.eventTitle}
              fill
              className="object-cover rounded-lg"
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg mb-1 line-clamp-2">
              {ticket.eventTitle}
            </h3>
            
            <div className="space-y-1 text-sm text-gray-600 mb-3">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(ticket.date, 'dd MMM yyyy, HH:mm')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>{ticket.location}</span>
              </div>
              {ticket.seatInfo && (
                <div className="flex items-center space-x-2">
                  <Ticket className="h-4 w-4" />
                  <span>{ticket.seatInfo.section}, Rândul {ticket.seatInfo.row}, Locul {ticket.seatInfo.seat}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{ticket.ticketType}</p>
                <p className="font-bold">{ticket.quantity}x {formatPrice(ticket.totalPrice / ticket.quantity)}</p>
              </div>
              
              <div className="flex space-x-2">
                {!isPast && (
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-1" />
                    Descarcă
                  </Button>
                )}
                {isPast && !ticket.rating && (
                  <Button size="sm" variant="outline">
                    <Star className="h-4 w-4 mr-1" />
                    Evaluează
                  </Button>
                )}
                {isPast && ticket.rating && (
                  <div className="flex items-center space-x-1 text-yellow-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-sm font-medium">{ticket.rating}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total bilete</p>
                      <p className="text-3xl font-bold">{mockUserStats.totalTickets}</p>
                    </div>
                    <Ticket className="h-8 w-8 text-primary-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Evenimente viitoare</p>
                      <p className="text-3xl font-bold">{mockUserStats.upcomingEvents}</p>
                    </div>
                    <Calendar className="h-8 w-8 text-primary-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Favorite</p>
                      <p className="text-3xl font-bold">{mockUserStats.favoriteEvents}</p>
                    </div>
                    <Heart className="h-8 w-8 text-primary-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total cheltuit</p>
                      <p className="text-3xl font-bold">{formatPrice(mockUserStats.totalSpent)}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-primary-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Events */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Evenimente viitoare</span>
                  <Link href="/dashboard?tab=tickets">
                    <Button variant="ghost" size="sm">
                      Vezi toate
                    </Button>
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockUpcomingTickets.slice(0, 2).map((ticket) => (
                    <TicketCard key={ticket.id} ticket={ticket} />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommended Events */}
            <Card>
              <CardHeader>
                <CardTitle>Recomandate pentru tine</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockFavoriteEvents.slice(0, 2).map((event) => (
                    <Link key={event.id} href={`/events/${event.id}`}>
                      <div className="flex space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                        <div className="w-16 h-16 relative flex-shrink-0">
                          <Image
                            src={event.image}
                            alt={event.title}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm line-clamp-2">
                            {event.title}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(event.date, 'dd MMM')} • {event.location}
                          </p>
                          <p className="text-sm font-medium text-primary-500 mt-1">
                            de la {formatPrice(event.price)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'tickets':
        return (
          <div className="space-y-8">
            {/* Upcoming Tickets */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Evenimente viitoare</h2>
              <div className="space-y-4">
                {mockUpcomingTickets.map((ticket) => (
                  <TicketCard key={ticket.id} ticket={ticket} />
                ))}
              </div>
            </div>

            {/* Past Tickets */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Evenimente trecute</h2>
              <div className="space-y-4">
                {mockPastTickets.map((ticket) => (
                  <TicketCard key={ticket.id} ticket={ticket} isPast />
                ))}
              </div>
            </div>
          </div>
        );

      case 'favorites':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Evenimente favorite</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockFavoriteEvents.map((event) => (
                <Link key={event.id} href={`/events/${event.id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="relative h-48">
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className="object-cover rounded-t-xl"
                      />
                      <button className="absolute top-3 right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                        <Heart className="h-4 w-4 fill-current" />
                      </button>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2 line-clamp-2">
                        {event.title}
                      </h3>
                      <div className="space-y-1 text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(event.date, 'dd MMM yyyy')}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                      <p className="font-bold text-primary-500">
                        de la {formatPrice(event.price)}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Profilul meu</h2>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-6 mb-6">
                  <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
                    {currentUser.photoURL ? (
                      <img
                        src={currentUser.photoURL}
                        alt={currentUser.displayName || 'User'}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-10 w-10 text-primary-500" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">
                      {currentUser.displayName || 'Utilizator'}
                    </h3>
                    <p className="text-gray-600">{currentUser.email}</p>
                    <p className="text-sm text-gray-500">
                      Membru din {formatDate(currentUser.createdAt || new Date(), 'MMM yyyy')}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nume complet
                    </label>
                    <p className="text-gray-900">{currentUser.displayName || 'Necompletat'}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <p className="text-gray-900">{currentUser.email}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telefon
                    </label>
                    <p className="text-gray-900">{currentUser.phoneNumber || 'Necompletat'}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipul contului
                    </label>
                    <p className="text-gray-900 capitalize">{currentUser.role}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <Button>
                    Editează profilul
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'settings':
        return (
          <div className="max-w-2xl space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Setări</h2>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <span>Notificări</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <label className="flex items-center justify-between">
                  <span className="text-sm">Notificări email pentru evenimente noi</span>
                  <input type="checkbox" className="toggle" defaultChecked />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm">Memento-uri pentru evenimente</span>
                  <input type="checkbox" className="toggle" defaultChecked />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm">Oferte și reduceri</span>
                  <input type="checkbox" className="toggle" />
                </label>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Metode de plată</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <CreditCard className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Nu ai încă metode de plată salvate</p>
                  <Button variant="outline" className="mt-4">
                    Adaugă o metodă de plată
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Privacy */}
            <Card>
              <CardHeader>
                <CardTitle>Confidențialitate și securitate</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  Schimbă parola
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Descarcă datele mele
                </Button>
                <Button variant="destructive" className="w-full justify-start">
                  Șterge contul
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bună, {currentUser.displayName?.split(' ')[0] || 'Utilizator'}!
          </h1>
          <p className="text-gray-600">
            Gestionează biletele, evenimentele favorite și setările contului.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-50 text-primary-700 border border-primary-200'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </Layout>
  );
}