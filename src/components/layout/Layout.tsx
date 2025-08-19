'use client';

import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Toaster } from 'react-hot-toast';

interface LayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  className?: string;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  showHeader = true,
  showFooter = true,
  className = '',
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {showHeader && <Header />}
      
      <main className={`flex-1 ${className}`}>
        {children}
      </main>
      
      {showFooter && <Footer />}
      
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#00A3E0',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
};