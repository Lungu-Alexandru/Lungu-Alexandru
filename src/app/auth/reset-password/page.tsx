'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { isValidEmail } from '@/lib/utils';

export default function ResetPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Email-ul este obligatoriu');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Email-ul nu este valid');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await resetPassword(email);
      setSent(true);
    } catch (error: any) {
      console.error('Reset password error:', error);
      if (error.code === 'auth/user-not-found') {
        setError('Nu există cont cu acest email');
      } else {
        setError('A apărut o eroare. Încercați din nou.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <Layout showFooter={false}>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
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
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Email trimis cu succes!
                </h2>
                
                <p className="text-gray-600 mb-6">
                  Am trimis instrucțiunile de resetare parolă la adresa{' '}
                  <span className="font-medium text-gray-900">{email}</span>.
                  Verifică-ți inbox-ul și urmează instrucțiunile.
                </p>

                <div className="space-y-3">
                  <p className="text-sm text-gray-500">
                    Nu ai primit email-ul? Verifică folderul spam sau
                  </p>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setSent(false);
                      setEmail('');
                    }}
                    className="w-full"
                  >
                    Încearcă din nou
                  </Button>
                  
                  <Link href="/auth/login">
                    <Button variant="ghost" className="w-full">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Înapoi la conectare
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

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
            <h2 className="text-3xl font-bold text-gray-900">
              Resetează parola
            </h2>
            <p className="mt-2 text-gray-600">
              Introdu adresa de email pentru a primi instrucțiunile de resetare
            </p>
          </div>

          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="email"
                  label="Email"
                  placeholder="numele@exemplu.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  leftIcon={<Mail className="h-4 w-4" />}
                  error={error}
                  disabled={loading}
                  autoFocus
                />

                <Button
                  type="submit"
                  className="w-full"
                  loading={loading}
                  disabled={loading || !email}
                >
                  Trimite instrucțiunile
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Link
                  href="/auth/login"
                  className="inline-flex items-center text-sm text-primary-500 hover:text-primary-600"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Înapoi la conectare
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Help Section */}
          <div className="text-center text-sm text-gray-600">
            <p className="mb-2">Ai nevoie de ajutor?</p>
            <Link
              href="/contact"
              className="text-primary-500 hover:text-primary-600 font-medium"
            >
              Contactează echipa de suport
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}