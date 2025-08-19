'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  Star, 
  Users,
  SlidersHorizontal,
  Grid,
  List,
  ArrowUpDown
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { formatDate, formatPrice, translateCategory } from '@/lib/utils';
import { EventCategory } from '@/types';

// Mock data for demonstration
const mockEvents = [
  {
    id: '1',
    title: 'Concert Delia - Turneu Național 2024',
    description: 'Delia revine cu un turneu spectaculos care promite să fie unul dintre cele mai mari evenimente muzicale ale anului.',
    category: 'music' as EventCategory,
    startDate: new Date('2024-02-15T20:00:00'),
    location: {
      name: 'Sala Palatului',
      address: 'Bulevardul Ion C. Brătianu 1',
      city: 'București',
      country: 'România',
      coordinates: { lat: 44.4268, lng: 26.1025 }
    },
    images: ['https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800'],
    organizerName: 'Music Events Pro',
    ticketTypes: [
      { id: '1', name: 'Standard', price: 120, quantity: 1000, sold: 650, type: 'standard' as const },
      { id: '2', name: 'VIP', price: 250, quantity: 200, sold: 180, type: 'vip' as const }
    ],
    totalTickets: 1200,
    soldTickets: 830,
    featured: true,
    status: 'approved' as const,
    tags: ['pop', 'concert', 'live'],
    rating: 4.8,
  },
  {
    id: '2',
    title: 'Teatrul Național - Hamlet',
    description: 'O interpretare modernă a capodoperei shakespeariene, cu actori de renume pe scena națională.',
    category: 'theater' as EventCategory,
    startDate: new Date('2024-02-20T19:30:00'),
    location: {
      name: 'Teatrul Național',
      address: 'Bulevardul Nicolae Bălcescu 2',
      city: 'București',
      country: 'România',
      coordinates: { lat: 44.4378, lng: 26.0969 }
    },
    images: ['https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800'],
    organizerName: 'Teatrul Național București',
    ticketTypes: [
      { id: '1', name: 'Loja', price: 150, quantity: 100, sold: 95, type: 'vip' as const },
      { id: '2', name: 'Balcon', price: 85, quantity: 300, sold: 280, type: 'standard' as const },
      { id: '3', name: 'Amfiteatru', price: 60, quantity: 400, sold: 320, type: 'standard' as const }
    ],
    totalTickets: 800,
    soldTickets: 695,
    featured: true,
    status: 'approved' as const,
    tags: ['teatru', 'clasic', 'shakespeare'],
    rating: 4.9,
  },
  {
    id: '3',
    title: 'Dinamo vs FCSB - Derby Eternal',
    description: 'Cel mai așteptat meci al sezonului! Derby-ul Bucureștiului aduce emoții mari pe Arena Națională.',
    category: 'sports' as EventCategory,
    startDate: new Date('2024-02-25T20:30:00'),
    location: {
      name: 'Arena Națională',
      address: 'Strada Basarabia 37-39',
      city: 'București',
      country: 'România',
      coordinates: { lat: 44.4375, lng: 26.1526 }
    },
    images: ['https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800'],
    organizerName: 'Liga Profesionistă de Fotbal',
    ticketTypes: [
      { id: '1', name: 'Peluză', price: 50, quantity: 20000, sold: 18500, type: 'standard' as const },
      { id: '2', name: 'Tribună', price: 100, quantity: 25000, sold: 22000, type: 'standard' as const },
      { id: '3', name: 'VIP', price: 300, quantity: 2000, sold: 1800, type: 'vip' as const }
    ],
    totalTickets: 47000,
    soldTickets: 42300,
    featured: true,
    status: 'approved' as const,
    tags: ['fotbal', 'derby', 'bucuresti'],
    rating: 4.7,
  },
];

const categories = [
  { id: 'all', name: 'Toate', count: 245 },
  { id: 'music', name: 'Muzică', count: 89 },
  { id: 'theater', name: 'Teatru', count: 45 },
  { id: 'sports', name: 'Sport', count: 67 },
  { id: 'conferences', name: 'Conferințe', count: 34 },
  { id: 'film', name: 'Film', count: 23 },
];

export default function EventsPage() {
  const searchParams = useSearchParams();
  const [events, setEvents] = useState(mockEvents);
  const [filteredEvents, setFilteredEvents] = useState(mockEvents);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams?.get('category') || 'all');
  const [selectedCity, setSelectedCity] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [sortBy, setSortBy] = useState<'date' | 'price' | 'popularity'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    applyFilters();
  }, [searchQuery, selectedCategory, selectedCity, priceRange, dateRange, sortBy, sortOrder]);

  const applyFilters = () => {
    let filtered = [...events];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.organizerName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(event => event.category === selectedCategory);
    }

    // City filter
    if (selectedCity) {
      filtered = filtered.filter(event => 
        event.location.city.toLowerCase().includes(selectedCity.toLowerCase())
      );
    }

    // Price filter
    filtered = filtered.filter(event => {
      const minPrice = Math.min(...event.ticketTypes.map(t => t.price));
      return minPrice >= priceRange.min && minPrice <= priceRange.max;
    });

    // Date filter
    if (dateRange.start) {
      filtered = filtered.filter(event => 
        new Date(event.startDate) >= new Date(dateRange.start)
      );
    }
    if (dateRange.end) {
      filtered = filtered.filter(event => 
        new Date(event.startDate) <= new Date(dateRange.end)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
          break;
        case 'price':
          const aPrice = Math.min(...a.ticketTypes.map(t => t.price));
          const bPrice = Math.min(...b.ticketTypes.map(t => t.price));
          comparison = aPrice - bPrice;
          break;
        case 'popularity':
          comparison = (b.soldTickets / b.totalTickets) - (a.soldTickets / a.totalTickets);
          break;
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    setFilteredEvents(filtered);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedCity('');
    setPriceRange({ min: 0, max: 1000 });
    setDateRange({ start: '', end: '' });
    setSortBy('date');
    setSortOrder('asc');
  };

  const EventCard = ({ event, isListView = false }: { event: typeof mockEvents[0], isListView?: boolean }) => (
    <Link href={`/events/${event.id}`}>
      <Card className={`group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer ${
        isListView ? 'flex flex-row' : ''
      }`}>
        <div className={`relative ${isListView ? 'w-48 h-32 flex-shrink-0' : 'h-48 w-full'} overflow-hidden rounded-t-xl ${isListView ? 'rounded-l-xl rounded-t-xl' : ''}`}>
          <Image
            src={event.images[0]}
            alt={event.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3 flex items-center space-x-2">
            <span className="bg-primary-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              {translateCategory(event.category)}
            </span>
            {event.featured && (
              <span className="bg-accent-500 text-gray-900 px-2 py-1 rounded-full text-xs font-medium">
                Recomandat
              </span>
            )}
          </div>
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur rounded-full px-2 py-1 flex items-center space-x-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-medium">{event.rating}</span>
          </div>
        </div>
        
        <CardContent className={`${isListView ? 'flex-1' : ''} p-4`}>
          <h3 className="font-semibold text-lg mb-2 group-hover:text-primary-500 transition-colors line-clamp-2">
            {event.title}
          </h3>
          
          <div className="space-y-2 text-sm text-gray-600 mb-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(event.startDate, 'dd MMM yyyy, HH:mm')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>{event.location.name}, {event.location.city}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>{event.soldTickets.toLocaleString()} / {event.totalTickets.toLocaleString()} bilete</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">de la</p>
              <p className="text-xl font-bold text-primary-500">
                {formatPrice(Math.min(...event.ticketTypes.map(t => t.price)))}
              </p>
            </div>
            
            <div className="text-right">
              <p className="text-sm text-gray-500 mb-1">{event.organizerName}</p>
              <div className="flex items-center space-x-1">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary-500 h-2 rounded-full" 
                    style={{ width: `${(event.soldTickets / event.totalTickets) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 ml-2">
                  {Math.round((event.soldTickets / event.totalTickets) * 100)}%
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Descoperă evenimente
          </h1>
          <p className="text-xl text-gray-600">
            {filteredEvents.length} evenimente disponibile
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Caută evenimente, artiști sau locații..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="h-4 w-4" />}
                className="h-12"
              />
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(true)}
                leftIcon={<Filter className="h-4 w-4" />}
              >
                Filtrează
              </Button>
              <Button
                variant="outline"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                leftIcon={viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
              >
                {viewMode === 'grid' ? 'Listă' : 'Grilă'}
              </Button>
            </div>
          </div>

          {/* Quick Category Filters */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Sortează după:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="date">Dată</option>
              <option value="price">Preț</option>
              <option value="popularity">Popularitate</option>
            </select>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              leftIcon={<ArrowUpDown className="h-4 w-4" />}
            >
              {sortOrder === 'asc' ? 'Crescător' : 'Descrescător'}
            </Button>
          </div>
          
          {(searchQuery || selectedCategory !== 'all' || selectedCity) && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Șterge filtrele
            </Button>
          )}
        </div>

        {/* Events Grid/List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-300 h-48 rounded-t-xl" />
                <div className="bg-white p-4 rounded-b-xl">
                  <div className="h-4 bg-gray-300 rounded mb-2" />
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-4" />
                  <div className="h-3 bg-gray-300 rounded mb-2" />
                  <div className="h-3 bg-gray-300 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }>
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} isListView={viewMode === 'list'} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nu am găsit evenimente
            </h3>
            <p className="text-gray-600 mb-6">
              Încearcă să modifici criteriile de căutare sau să ștergi filtrele.
            </p>
            <Button onClick={clearFilters}>
              Șterge toate filtrele
            </Button>
          </div>
        )}

        {/* Load More */}
        {filteredEvents.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Încarcă mai multe evenimente
            </Button>
          </div>
        )}
      </div>

      {/* Filters Modal */}
      <Modal
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        title="Filtrează evenimente"
        size="md"
      >
        <div className="space-y-6">
          {/* City Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Orașul
            </label>
            <Input
              type="text"
              placeholder="București, Cluj-Napoca..."
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              leftIcon={<MapPin className="h-4 w-4" />}
            />
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Intervalul de preț
            </label>
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="number"
                placeholder="Min"
                value={priceRange.min || ''}
                onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) || 0 })}
              />
              <Input
                type="number"
                placeholder="Max"
                value={priceRange.max || ''}
                onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) || 1000 })}
              />
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Perioada
            </label>
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              />
              <Input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={clearFilters}>
              Șterge filtrele
            </Button>
            <Button onClick={() => setShowFilters(false)}>
              Aplică filtrele
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
}