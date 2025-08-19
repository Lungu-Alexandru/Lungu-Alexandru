'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Menu, 
  X, 
  User, 
  ShoppingCart, 
  Bell,
  LogOut,
  Settings,
  Ticket,
  Calendar,
  MapPin
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { cn } from '@/lib/utils';

export const Header: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/events?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchModalOpen(false);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navigationItems = [
    { href: '/events', label: 'Evenimente', icon: Calendar },
    { href: '/categories', label: 'Categorii', icon: MapPin },
    { href: '/organizers', label: 'Organizatori', icon: User },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg gradient-bg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">G</span>
                </div>
                <span className="text-xl font-bold text-gradient">Gettiks</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-1 text-gray-600 hover:text-primary-500 transition-colors"
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* Search and Actions */}
            <div className="flex items-center space-x-4">
              {/* Search Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchModalOpen(true)}
                className="md:hidden"
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* Desktop Search */}
              <form onSubmit={handleSearch} className="hidden md:flex">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Caută evenimente..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    leftIcon={<Search className="h-4 w-4" />}
                    className="w-64 pr-10"
                  />
                </div>
              </form>

              {/* User Actions */}
              {currentUser ? (
                <div className="flex items-center space-x-2">
                  {/* Notifications */}
                  <Button variant="ghost" size="icon">
                    <Bell className="h-5 w-5" />
                  </Button>

                  {/* Cart */}
                  <Button variant="ghost" size="icon">
                    <ShoppingCart className="h-5 w-5" />
                  </Button>

                  {/* User Menu */}
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="rounded-full"
                    >
                      {currentUser.photoURL ? (
                        <img
                          src={currentUser.photoURL}
                          alt={currentUser.displayName || 'User'}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-5 w-5" />
                      )}
                    </Button>

                    {/* User Dropdown */}
                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">
                            {currentUser.displayName || 'Utilizator'}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {currentUser.email}
                          </p>
                        </div>
                        
                        <Link
                          href="/dashboard"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <User className="h-4 w-4 mr-2" />
                          Profilul meu
                        </Link>
                        
                        <Link
                          href="/dashboard/tickets"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Ticket className="h-4 w-4 mr-2" />
                          Biletele mele
                        </Link>

                        {currentUser.role === 'organizer' && (
                          <Link
                            href="/dashboard/organizer"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Calendar className="h-4 w-4 mr-2" />
                            Evenimente mele
                          </Link>
                        )}
                        
                        <Link
                          href="/dashboard/settings"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Setări
                        </Link>
                        
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            handleLogout();
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Deconectare
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link href="/auth/login">
                    <Button variant="ghost">Conectare</Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button>Înregistrare</Button>
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <nav className="flex flex-col space-y-2">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center space-x-2 px-2 py-2 text-gray-600 hover:text-primary-500 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Search Modal */}
      <Modal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        title="Caută evenimente"
        size="md"
      >
        <form onSubmit={handleSearch} className="space-y-4">
          <Input
            type="text"
            placeholder="Introdu numele evenimentului, artistul sau locația..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
            className="w-full"
            autoFocus
          />
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsSearchModalOpen(false)}
            >
              Anulează
            </Button>
            <Button type="submit" disabled={!searchQuery.trim()}>
              Caută
            </Button>
          </div>
        </form>
      </Modal>

      {/* Click outside to close user menu */}
      {isUserMenuOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}
    </>
  );
};