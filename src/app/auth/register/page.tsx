'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Phone, Building } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { isValidEmail, isValidPhone } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { register, loginWithGoogle, loginWithFacebook, loginWithApple } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [accountType, setAccountType] = useState<'user' | 'organizer'>('user');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    companyVat: '',
    agreeToTerms: false,
    agreeToNewsletter: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Prenumele este obligatoriu';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Numele este obligatoriu';
    }

    if (!formData.email) {
      newErrors.email = 'Email-ul este obligatoriu';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Email-ul nu este valid';
    }

    if (formData.phone && !isValidPhone(formData.phone)) {
      newErrors.phone = 'Numărul de telefon nu este valid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.password) {
      newErrors.password = 'Parola este obligatorie';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Parola trebuie să aibă cel puțin 8 caractere';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Parola trebuie să conțină cel puțin o literă mică, o literă mare și o cifră';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Parolele nu se potrivesc';
    }

    if (accountType === 'organizer' && !formData.companyName.trim()) {
      newErrors.companyName = 'Numele companiei este obligatoriu pentru organizatori';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'Trebuie să accepți termenii și condițiile';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep2()) return;

    setLoading(true);
    try {
      const userData = {
        displayName: `${formData.firstName} ${formData.lastName}`,
        phoneNumber: formData.phone,
        role: accountType,
        preferences: {
          language: 'ro' as const,
          notifications: formData.agreeToNewsletter,
          categories: []
        }
      };

      await register(formData.email, formData.password, userData);
      
      toast.success('Cont creat cu succes! Verifică-ți email-ul pentru a activa contul.');
      router.push('/auth/verify-email');
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error.code === 'auth/email-already-in-use') {
        setErrors({ email: 'Există deja un cont cu acest email' });
        setStep(1);
      } else {
        toast.error('Eroare la înregistrare. Încercați din nou.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'apple') => {
    setLoading(true);
    try {
      if (provider === 'google') {
        await loginWithGoogle();
      } else if (provider === 'facebook') {
        await loginWithFacebook();
      } else if (provider === 'apple') {
        await loginWithApple();
      }
      router.push('/dashboard');
    } catch (error) {
      console.error(`${provider} login error:`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
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
            <h2 className="text-3xl font-bold text-gray-900">
              Creează-ți contul
            </h2>
            <p className="mt-2 text-gray-600">
              Ai deja cont?{' '}
              <Link href="/auth/login" className="text-primary-500 hover:text-primary-600 font-medium">
                Conectează-te aici
              </Link>
            </p>
          </div>

          <Card>
            <CardContent className="p-6">
              {step === 1 ? (
                <>
                  {/* Account Type Selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Tipul contului
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setAccountType('user')}
                        className={`p-4 border rounded-lg text-center transition-all ${
                          accountType === 'user'
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <User className="h-6 w-6 mx-auto mb-2" />
                        <div className="font-medium">Participant</div>
                        <div className="text-xs text-gray-500">Cumpără bilete</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setAccountType('organizer')}
                        className={`p-4 border rounded-lg text-center transition-all ${
                          accountType === 'organizer'
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <Building className="h-6 w-6 mx-auto mb-2" />
                        <div className="font-medium">Organizator</div>
                        <div className="text-xs text-gray-500">Creează evenimente</div>
                      </button>
                    </div>
                  </div>

                  {/* Social Registration */}
                  <div className="space-y-3 mb-6">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => handleSocialLogin('google')}
                      disabled={loading}
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      Înregistrează-te cu Google
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => handleSocialLogin('facebook')}
                      disabled={loading}
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      Înregistrează-te cu Facebook
                    </Button>
                  </div>

                  {/* Divider */}
                  <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">sau</span>
                    </div>
                  </div>

                  {/* Step 1 Form */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        type="text"
                        label="Prenume"
                        placeholder="Ion"
                        value={formData.firstName}
                        onChange={handleInputChange('firstName')}
                        error={errors.firstName}
                        disabled={loading}
                      />
                      <Input
                        type="text"
                        label="Nume"
                        placeholder="Popescu"
                        value={formData.lastName}
                        onChange={handleInputChange('lastName')}
                        error={errors.lastName}
                        disabled={loading}
                      />
                    </div>

                    <Input
                      type="email"
                      label="Email"
                      placeholder="numele@exemplu.com"
                      value={formData.email}
                      onChange={handleInputChange('email')}
                      leftIcon={<Mail className="h-4 w-4" />}
                      error={errors.email}
                      disabled={loading}
                    />

                    <Input
                      type="tel"
                      label="Telefon (opțional)"
                      placeholder="+40 123 456 789"
                      value={formData.phone}
                      onChange={handleInputChange('phone')}
                      leftIcon={<Phone className="h-4 w-4" />}
                      error={errors.phone}
                      disabled={loading}
                    />

                    <Button
                      type="button"
                      onClick={handleNext}
                      className="w-full"
                      disabled={loading}
                    >
                      Continuă
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  {/* Step 2 Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="mb-4">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="text-sm text-primary-500 hover:text-primary-600"
                      >
                        ← Înapoi la datele personale
                      </button>
                    </div>

                    <Input
                      type="password"
                      label="Parola"
                      placeholder="Minim 8 caractere"
                      value={formData.password}
                      onChange={handleInputChange('password')}
                      leftIcon={<Lock className="h-4 w-4" />}
                      showPasswordToggle
                      error={errors.password}
                      disabled={loading}
                    />

                    <Input
                      type="password"
                      label="Confirmă parola"
                      placeholder="Repetă parola"
                      value={formData.confirmPassword}
                      onChange={handleInputChange('confirmPassword')}
                      leftIcon={<Lock className="h-4 w-4" />}
                      showPasswordToggle
                      error={errors.confirmPassword}
                      disabled={loading}
                    />

                    {accountType === 'organizer' && (
                      <>
                        <Input
                          type="text"
                          label="Numele companiei"
                          placeholder="SRL/SA/PFA"
                          value={formData.companyName}
                          onChange={handleInputChange('companyName')}
                          leftIcon={<Building className="h-4 w-4" />}
                          error={errors.companyName}
                          disabled={loading}
                        />

                        <Input
                          type="text"
                          label="CIF/CUI (opțional)"
                          placeholder="RO12345678"
                          value={formData.companyVat}
                          onChange={handleInputChange('companyVat')}
                          error={errors.companyVat}
                          disabled={loading}
                        />
                      </>
                    )}

                    <div className="space-y-3">
                      <label className="flex items-start">
                        <input
                          type="checkbox"
                          checked={formData.agreeToTerms}
                          onChange={handleInputChange('agreeToTerms')}
                          className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300 rounded mt-1"
                          disabled={loading}
                        />
                        <span className="ml-2 text-sm text-gray-600">
                          Accept{' '}
                          <Link href="/terms" className="text-primary-500 hover:text-primary-600">
                            Termenii și condițiile
                          </Link>{' '}
                          și{' '}
                          <Link href="/privacy" className="text-primary-500 hover:text-primary-600">
                            Politica de confidențialitate
                          </Link>
                        </span>
                      </label>
                      {errors.agreeToTerms && (
                        <p className="text-sm text-red-600">{errors.agreeToTerms}</p>
                      )}

                      <label className="flex items-start">
                        <input
                          type="checkbox"
                          checked={formData.agreeToNewsletter}
                          onChange={handleInputChange('agreeToNewsletter')}
                          className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300 rounded mt-1"
                          disabled={loading}
                        />
                        <span className="ml-2 text-sm text-gray-600">
                          Vreau să primesc notificări despre evenimente și oferte speciale
                        </span>
                      </label>
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      loading={loading}
                      disabled={loading}
                    >
                      Creează contul
                    </Button>
                  </form>
                </>
              )}
            </CardContent>
          </Card>

          {/* Progress Indicator */}
          <div className="flex justify-center space-x-2">
            <div className={`w-3 h-3 rounded-full transition-colors ${
              step >= 1 ? 'bg-primary-500' : 'bg-gray-300'
            }`} />
            <div className={`w-3 h-3 rounded-full transition-colors ${
              step >= 2 ? 'bg-primary-500' : 'bg-gray-300'
            }`} />
          </div>
        </div>
      </div>
    </Layout>
  );
}