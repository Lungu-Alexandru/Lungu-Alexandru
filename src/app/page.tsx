'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Search, 
  Calendar, 
  MapPin, 
  Star, 
  ArrowRight,
  Music,
  Theater,
  Film,
  Trophy,
  Users,
  Ticket,
  TrendingUp,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useAuth } from '@/contexts/AuthContext';
import { formatDate, formatPrice, translateCategory } from '@/lib/utils';

// Mock data for demonstration
const featuredEvents = [
  {
    id: '1',
    title: 'Concert Delia - Turneu Național 2024',
    category: 'music',
    date: new Date('2024-02-15'),
    location: 'Sala Palatului, București',
    price: 120,
    image: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800',
    organizer: 'Music Events Pro',
    rating: 4.8,
    attendees: 2500,
  },
  {
    id: '2',
    title: 'Teatrul Național - Hamlet',
    category: 'theater',
    date: new Date('2024-02-20'),
    location: 'Teatrul Național, București',
    price: 85,
    image: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800',
    organizer: 'Teatrul Național',
    rating: 4.9,
    attendees: 800,
  },
  {
    id: '3',
    title: 'Dinamo vs FCSB - Derby Eternal',
    category: 'sports',
    date: new Date('2024-02-25'),
    location: 'Arena Națională, București',
    price: 150,
    image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800',
    organizer: 'LPF',
    rating: 4.7,
    attendees: 55000,
  },
];

const categories = [
  { id: 'music', name: 'Muzică & Concerte', icon: Music, count: 245, color: 'bg-purple-500' },
  { id: 'theater', name: 'Teatru & Arte', icon: Theater, count: 128, color: 'bg-pink-500' },
  { id: 'film', name: 'Film & Proiecții', icon: Film, count: 89, color: 'bg-indigo-500' },
  { id: 'sports', name: 'Sport', icon: Trophy, count: 156, color: 'bg-green-500' },
  { id: 'conferences', name: 'Conferințe', icon: Users, count: 234, color: 'bg-blue-500' },
  { id: 'exhibitions', name: 'Expoziții', icon: Star, count: 67, color: 'bg-yellow-500' },
];

const stats = [
  { label: 'Evenimente active', value: '2,500+', icon: Calendar },
  { label: 'Bilete vândute', value: '150K+', icon: Ticket },
  { label: 'Organizatori', value: '500+', icon: Users },
  { label: 'Satisfacție clienți', value: '98%', icon: TrendingUp },
];

export default function HomePage() {
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredEvents.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/events?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredEvents.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredEvents.length) % featuredEvents.length);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Descoperă evenimente
              <span className="block text-accent-400">extraordinare</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 animate-fade-in">
              Platforma modernă de ticketing care îți aduce cele mai tari evenimente 
              din România direct la tine.
            </p>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto animate-slide-up">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Caută evenimente, artiști sau locații..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftIcon={<Search className="h-5 w-5" />}
                  className="h-14 text-lg pr-16 bg-white/95 backdrop-blur border-0 shadow-xl"
                />
                <Button
                  type="submit"
                  className="absolute right-2 top-2 h-10 px-6"
                  disabled={!searchQuery.trim()}
                >
                  Caută
                </Button>
              </div>
            </form>

            {/* Quick Categories */}
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {categories.slice(0, 4).map((category) => (
                <Link
                  key={category.id}
                  href={`/events?category=${category.id}`}
                  className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur hover:bg-white/20 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105"
                >
                  <category.icon className="h-4 w-4" />
                  <span>{category.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events Carousel */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Evenimente în evidență
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Cele mai populare evenimente din această perioadă
            </p>
          </div>

          <div className="relative max-w-6xl mx-auto">
            <div className="overflow-hidden rounded-2xl">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {featuredEvents.map((event, index) => (
                  <div key={event.id} className="w-full flex-shrink-0">
                    <div className="relative h-96 md:h-[500px]">
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      
                      <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                        <div className="max-w-4xl mx-auto">
                          <div className="flex items-center space-x-2 mb-3">
                            <span className="bg-primary-500 px-3 py-1 rounded-full text-sm font-medium">
                              {translateCategory(event.category)}
                            </span>
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm">{event.rating}</span>
                            </div>
                          </div>
                          
                          <h3 className="text-2xl md:text-4xl font-bold mb-4">
                            {event.title}
                          </h3>
                          
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div className="space-y-2 mb-4 md:mb-0">
                              <div className="flex items-center space-x-2">
                                <Calendar className="h-5 w-5" />
                                <span>{formatDate(event.date, 'dd MMMM yyyy')}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <MapPin className="h-5 w-5" />
                                <span>{event.location}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Users className="h-5 w-5" />
                                <span>{event.attendees.toLocaleString()} participanți</span>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <p className="text-2xl font-bold mb-2">
                                de la {formatPrice(event.price)}
                              </p>
                              <Link href={`/events/${event.id}`}>
                                <Button size="lg" className="bg-accent-500 hover:bg-accent-600 text-gray-900">
                                  Vezi detalii
                                  <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Carousel Controls */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
            >
              <ChevronLeft className="h-6 w-6 text-gray-800" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
            >
              <ChevronRight className="h-6 w-6 text-gray-800" />
            </button>

            {/* Carousel Indicators */}
            <div className="flex justify-center space-x-2 mt-6">
              {featuredEvents.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentSlide ? 'bg-primary-500 scale-125' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Explorează categoriile
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Găsește evenimente din domeniul care te pasionează
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link key={category.id} href={`/events?category=${category.id}`}>
                <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                        <category.icon className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-2xl font-bold text-gray-400 group-hover:text-primary-500 transition-colors">
                        {category.count}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-500 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {category.count} evenimente disponibile
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary-500 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Gettiks în cifre
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Încrederea a mii de utilizatori și organizatori
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4">
                  <stat.icon className="h-8 w-8" />
                </div>
                <div className="text-3xl md:text-4xl font-bold mb-2">
                  {stat.value}
                </div>
                <div className="text-blue-100">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {currentUser ? 'Descoperă următorul tău eveniment favorit' : 'Începe aventura cu Gettiks'}
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              {currentUser 
                ? 'Explorează mii de evenimente și cumpără bilete în siguranță'
                : 'Înregistrează-te astăzi și primești acces la cele mai tari evenimente'
              }
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {currentUser ? (
                <>
                  <Link href="/events">
                    <Button size="lg" className="w-full sm:w-auto">
                      Explorează evenimente
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  {currentUser.role !== 'organizer' && (
                    <Link href="/organizers/register">
                      <Button variant="outline" size="lg" className="w-full sm:w-auto">
                        Devino organizator
                      </Button>
                    </Link>
                  )}
                </>
              ) : (
                <>
                  <Link href="/auth/register">
                    <Button size="lg" className="w-full sm:w-auto">
                      Înregistrează-te gratuit
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/events">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                      Explorează evenimente
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}