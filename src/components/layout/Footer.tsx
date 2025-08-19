'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Mail, 
  Phone, 
  MapPin,
  Smartphone,
  CreditCard,
  Shield,
  Clock
} from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Evenimente',
      links: [
        { href: '/events', label: 'Toate evenimentele' },
        { href: '/events?category=music', label: 'Muzică & Concerte' },
        { href: '/events?category=theater', label: 'Teatru & Arte' },
        { href: '/events?category=sports', label: 'Sport' },
        { href: '/events?category=conferences', label: 'Conferințe' },
      ],
    },
    {
      title: 'Organizatori',
      links: [
        { href: '/organizers/register', label: 'Devino organizator' },
        { href: '/organizers/dashboard', label: 'Dashboard organizator' },
        { href: '/organizers/help', label: 'Ghid organizator' },
        { href: '/organizers/pricing', label: 'Prețuri & Comisioane' },
      ],
    },
    {
      title: 'Suport',
      links: [
        { href: '/help', label: 'Centrul de ajutor' },
        { href: '/contact', label: 'Contact' },
        { href: '/faq', label: 'Întrebări frecvente' },
        { href: '/terms', label: 'Termeni și condiții' },
        { href: '/privacy', label: 'Politica de confidențialitate' },
      ],
    },
    {
      title: 'Companie',
      links: [
        { href: '/about', label: 'Despre noi' },
        { href: '/careers', label: 'Cariere' },
        { href: '/press', label: 'Presă' },
        { href: '/blog', label: 'Blog' },
        { href: '/partnerships', label: 'Parteneriate' },
      ],
    },
  ];

  const features = [
    {
      icon: Smartphone,
      title: 'Mobile-First',
      description: 'Optimizat pentru toate dispozitivele'
    },
    {
      icon: CreditCard,
      title: 'Plăți Securizate',
      description: 'Stripe, Apple Pay, Google Pay'
    },
    {
      icon: Shield,
      title: 'Bilete Securizate',
      description: 'Coduri QR unice și criptate'
    },
    {
      icon: Clock,
      title: 'Suport 24/7',
      description: 'Echipa noastră te ajută oricând'
    },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Features Section */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-500 rounded-lg mb-4">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="h-10 w-10 rounded-lg gradient-bg flex items-center justify-center">
                <span className="text-white font-bold text-xl">G</span>
              </div>
              <span className="text-2xl font-bold text-gradient">Gettiks</span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-md">
              Platforma modernă de ticketing online care conectează organizatorii cu participanții. 
              Descoperă evenimente unice și cumpără bilete în siguranță.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              <a
                href="https://facebook.com/gettiks"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-500 transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com/gettiks"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-500 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com/gettiks"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary-500 transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Info */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-primary-500" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <a
                  href="mailto:support@gettiks.com"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  support@gettiks.com
                </a>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-primary-500" />
              <div>
                <p className="text-sm font-medium">Telefon</p>
                <a
                  href="tel:+40123456789"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  +40 123 456 789
                </a>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-primary-500" />
              <div>
                <p className="text-sm font-medium">Adresă</p>
                <p className="text-sm text-gray-400">
                  București, România
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400 mb-4 md:mb-0">
            © {currentYear} Gettiks. Toate drepturile rezervate.
          </p>
          
          <div className="flex flex-wrap items-center space-x-6 text-sm text-gray-400">
            <Link href="/terms" className="hover:text-white transition-colors">
              Termeni și condiții
            </Link>
            <Link href="/privacy" className="hover:text-white transition-colors">
              Politica de confidențialitate
            </Link>
            <Link href="/cookies" className="hover:text-white transition-colors">
              Politica de cookies
            </Link>
            <span>
              Powered by{' '}
              <a
                href="https://genium-soft.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-500 hover:text-primary-400 transition-colors"
              >
                Genium Soft
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};