'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, RefreshCw, CheckCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

export default function VerifyEmailPage() {
  const { firebaseUser, resendEmailVerification, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleResendEmail = async () => {
    setLoading(true);
    try {
      await resendEmailVerification();
      setSent(true);
      setTimeout(() => setSent(false), 3000);
    } catch (error) {
      console.error('Resend email error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <Layout showFooter={false}>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <Link href="/" className="inline-flex items-center space-x-2 mb-8">
              <div className="h-10 w-10 rounded-lg gradient-bg flex items-center justify-center">
                <span className="text-white font-bold text-xl">G</span>
              </div>
              <span className="text-2xl font-bold text-gradient">Gettiks</span>
            </Link>
          </div>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-primary-500" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Verifică-ți email-ul
              </h2>
              
              <p className="text-gray-600 mb-6">
                Am trimis un link de verificare la adresa{' '}
                <span className="font-medium text-gray-900">
                  {firebaseUser?.email}
                </span>
                . Dă click pe link pentru a-ți activa contul.
              </p>

              <div className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Important:</strong> Verifică și folderul spam dacă nu găsești email-ul în inbox.
                  </p>
                </div>

                <div className="space-y-3">
                  <p className="text-sm text-gray-500">
                    Nu ai primit email-ul?
                  </p>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleResendEmail}
                    loading={loading}
                    disabled={loading}
                    className="w-full"
                    leftIcon={sent ? <CheckCircle className="h-4 w-4" /> : <RefreshCw className="h-4 w-4" />}
                  >
                    {sent ? 'Email retrimis!' : 'Retrimite email-ul'}
                  </Button>
                </div>
              </div>

              {/* Instructions */}
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Ce să faci după verificare:
                </h3>
                <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside text-left">
                  <li>Deschide email-ul de la Gettiks</li>
                  <li>Dă click pe "Verifică email-ul"</li>
                  <li>Vei fi redirecționat pentru a te conecta</li>
                  <li>Începe să explorezi evenimente!</li>
                </ol>
              </div>

              {/* Footer Actions */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex flex-col space-y-3">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleLogout}
                    className="w-full"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Folosește alt cont
                  </Button>
                  
                  <p className="text-xs text-gray-500">
                    Ai probleme cu verificarea?{' '}
                    <Link href="/contact" className="text-primary-500 hover:text-primary-600">
                      Contactează suportul
                    </Link>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Auto-refresh notice */}
          <div className="text-center text-sm text-gray-500">
            <p>
              După ce îți verifici email-ul, reîncarcă această pagină pentru a continua.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}