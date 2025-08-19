'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  CreditCard, 
  Shield, 
  Calendar, 
  MapPin, 
  Ticket,
  User,
  Mail,
  Phone,
  Building,
  Lock,
  ArrowLeft,
  CheckCircle
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useAuth } from '@/contexts/AuthContext';
import { formatDate, formatPrice, calculateTotalWithCommissionAndVAT } from '@/lib/utils';
import toast from 'react-hot-toast';

// Mock data - in real app, fetch based on search params
const mockEventData = {
  id: '1',
  title: 'Concert Delia - Turneu Național 2024',
  startDate: new Date('2024-02-15T20:00:00'),
  location: {
    name: 'Sala Palatului',
    city: 'București'
  },
  image: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400',
  organizerName: 'Music Events Pro'
};

const mockTicketTypes = {
  '1': { id: '1', name: 'Early Bird', price: 100, description: 'Bilet cu reducere pentru cumpărătorii timpurii' },
  '2': { id: '2', name: 'Standard', price: 120, description: 'Bilet standard cu acces la eveniment' },
  '3': { id: '3', name: 'VIP Experience', price: 300, description: 'Experiența completă VIP cu avantaje exclusive' }
};

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Details, 2: Payment, 3: Confirmation

  // Get data from URL params
  const eventId = searchParams?.get('event') || '';
  const ticketTypeId = searchParams?.get('ticket') || '';
  const quantity = parseInt(searchParams?.get('quantity') || '1');

  // Mock data
  const event = mockEventData;
  const ticketType = mockTicketTypes[ticketTypeId as keyof typeof mockTicketTypes];

  const [formData, setFormData] = useState({
    // Personal Info
    firstName: currentUser?.displayName?.split(' ')[0] || '',
    lastName: currentUser?.displayName?.split(' ')[1] || '',
    email: currentUser?.email || '',
    phone: currentUser?.phoneNumber || '',
    
    // Billing Address
    billingAddress: {
      street: '',
      city: '',
      postalCode: '',
      country: 'România',
      company: '',
      vatNumber: ''
    },

    // Payment
    paymentMethod: 'card', // 'card', 'apple-pay', 'google-pay'
    
    // Agreements
    agreeToTerms: false,
    agreeToNewsletter: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Redirect if missing required params or not authenticated
    if (!currentUser) {
      router.push('/auth/login');
      return;
    }

    if (!eventId || !ticketTypeId || !ticketType) {
      router.push('/events');
      return;
    }
  }, [currentUser, eventId, ticketTypeId, ticketType, router]);

  if (!ticketType || !event) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p>Se încarcă...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const subtotal = ticketType.price * quantity;
  const { commission, vat, total } = calculateTotalWithCommissionAndVAT(subtotal);

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Prenumele este obligatoriu';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Numele este obligatoriu';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email-ul este obligatoriu';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefonul este obligatoriu';
    }

    if (!formData.billingAddress.street.trim()) {
      newErrors['billingAddress.street'] = 'Adresa este obligatorie';
    }

    if (!formData.billingAddress.city.trim()) {
      newErrors['billingAddress.city'] = 'Orașul este obligatoriu';
    }

    if (!formData.billingAddress.postalCode.trim()) {
      newErrors['billingAddress.postalCode'] = 'Codul poștal este obligatoriu';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'Trebuie să accepți termenii și condițiile';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...(formData as any)[parent],
          [child]: value
        }
      });
    } else {
      setFormData({ ...formData, [field]: value });
    }

    // Clear error
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real app, integrate with Stripe
      toast.success('Plată procesată cu succes!');
      setStep(3);
    } catch (error) {
      toast.error('Eroare la procesarea plății');
    } finally {
      setLoading(false);
    }
  };

  if (step === 3) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Plată confirmată!
            </h1>
            
            <p className="text-xl text-gray-600 mb-8">
              Biletele tale au fost rezervate cu succes. Vei primi un email cu detaliile comenzii.
            </p>

            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 relative">
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold">{event.title}</h3>
                    <p className="text-gray-600">{quantity}x {ticketType.name}</p>
                    <p className="text-sm text-gray-500">
                      {formatDate(event.startDate)} • {event.location.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{formatPrice(total)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Button size="lg" className="w-full" onClick={() => router.push('/dashboard/tickets')}>
                Vezi biletele mele
              </Button>
              <Button variant="outline" size="lg" className="w-full" onClick={() => router.push('/events')}>
                Explorează alte evenimente
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => step === 1 ? router.back() : setStep(1)}
            className="flex items-center text-primary-500 hover:text-primary-600 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Înapoi
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900">
            {step === 1 ? 'Detaliile comenzii' : 'Plată securizată'}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === 1 ? (
              <div className="space-y-6">
                {/* Personal Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <User className="h-5 w-5" />
                      <span>Informații personale</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Prenume"
                        value={formData.firstName}
                        onChange={handleInputChange('firstName')}
                        error={errors.firstName}
                      />
                      <Input
                        label="Nume"
                        value={formData.lastName}
                        onChange={handleInputChange('lastName')}
                        error={errors.lastName}
                      />
                    </div>
                    
                    <Input
                      label="Email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange('email')}
                      leftIcon={<Mail className="h-4 w-4" />}
                      error={errors.email}
                    />
                    
                    <Input
                      label="Telefon"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange('phone')}
                      leftIcon={<Phone className="h-4 w-4" />}
                      error={errors.phone}
                    />
                  </CardContent>
                </Card>

                {/* Billing Address */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Building className="h-5 w-5" />
                      <span>Adresa de facturare</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input
                      label="Adresa"
                      value={formData.billingAddress.street}
                      onChange={handleInputChange('billingAddress.street')}
                      error={errors['billingAddress.street']}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Orașul"
                        value={formData.billingAddress.city}
                        onChange={handleInputChange('billingAddress.city')}
                        error={errors['billingAddress.city']}
                      />
                      <Input
                        label="Codul poștal"
                        value={formData.billingAddress.postalCode}
                        onChange={handleInputChange('billingAddress.postalCode')}
                        error={errors['billingAddress.postalCode']}
                      />
                    </div>

                    <Input
                      label="Țara"
                      value={formData.billingAddress.country}
                      onChange={handleInputChange('billingAddress.country')}
                      disabled
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Compania (opțional)"
                        value={formData.billingAddress.company}
                        onChange={handleInputChange('billingAddress.company')}
                      />
                      <Input
                        label="CIF/CUI (opțional)"
                        value={formData.billingAddress.vatNumber}
                        onChange={handleInputChange('billingAddress.vatNumber')}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Terms and Newsletter */}
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <label className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          checked={formData.agreeToTerms}
                          onChange={handleInputChange('agreeToTerms')}
                          className="mt-1 h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">
                          Accept{' '}
                          <a href="/terms" className="text-primary-500 hover:text-primary-600">
                            Termenii și condițiile
                          </a>{' '}
                          și{' '}
                          <a href="/privacy" className="text-primary-500 hover:text-primary-600">
                            Politica de confidențialitate
                          </a>
                        </span>
                      </label>
                      {errors.agreeToTerms && (
                        <p className="text-sm text-red-600">{errors.agreeToTerms}</p>
                      )}

                      <label className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          checked={formData.agreeToNewsletter}
                          onChange={handleInputChange('agreeToNewsletter')}
                          className="mt-1 h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">
                          Vreau să primesc notificări despre evenimente și oferte speciale
                        </span>
                      </label>
                    </div>
                  </CardContent>
                </Card>

                <Button size="lg" className="w-full" onClick={handleNext}>
                  Continuă la plată
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Payment Method */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <CreditCard className="h-5 w-5" />
                      <span>Metoda de plată</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <button
                        onClick={() => setFormData({ ...formData, paymentMethod: 'card' })}
                        className={`p-4 border rounded-lg text-center transition-all ${
                          formData.paymentMethod === 'card'
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <CreditCard className="h-6 w-6 mx-auto mb-2" />
                        <div className="text-sm font-medium">Card bancar</div>
                      </button>

                      <button
                        onClick={() => setFormData({ ...formData, paymentMethod: 'apple-pay' })}
                        className={`p-4 border rounded-lg text-center transition-all ${
                          formData.paymentMethod === 'apple-pay'
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <div className="h-6 w-6 mx-auto mb-2 bg-black rounded text-white flex items-center justify-center text-xs">
                          
                        </div>
                        <div className="text-sm font-medium">Apple Pay</div>
                      </button>

                      <button
                        onClick={() => setFormData({ ...formData, paymentMethod: 'google-pay' })}
                        className={`p-4 border rounded-lg text-center transition-all ${
                          formData.paymentMethod === 'google-pay'
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <div className="h-6 w-6 mx-auto mb-2 bg-blue-500 rounded text-white flex items-center justify-center text-xs">
                          G
                        </div>
                        <div className="text-sm font-medium">Google Pay</div>
                      </button>
                    </div>

                    {formData.paymentMethod === 'card' && (
                      <div className="space-y-4 pt-4 border-t">
                        <Input
                          label="Numărul cardului"
                          placeholder="1234 5678 9012 3456"
                          leftIcon={<CreditCard className="h-4 w-4" />}
                        />
                        
                        <div className="grid grid-cols-2 gap-4">
                          <Input
                            label="Data expirării"
                            placeholder="MM/YY"
                          />
                          <Input
                            label="CVV"
                            placeholder="123"
                            leftIcon={<Lock className="h-4 w-4" />}
                          />
                        </div>

                        <Input
                          label="Numele de pe card"
                          placeholder="Ion Popescu"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Security Notice */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3 text-sm text-gray-600">
                      <Shield className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">Plată securizată</p>
                        <p>Datele tale sunt protejate prin criptare SSL și procesate prin Stripe.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Button 
                  size="lg" 
                  className="w-full" 
                  onClick={handlePayment}
                  loading={loading}
                  disabled={loading}
                >
                  Finalizează comanda - {formatPrice(total)}
                </Button>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Ticket className="h-5 w-5" />
                  <span>Rezumatul comenzii</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Event Info */}
                <div className="flex space-x-3">
                  <div className="w-16 h-16 relative flex-shrink-0">
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-sm line-clamp-2">
                      {event.title}
                    </h3>
                    <div className="text-xs text-gray-500 space-y-1 mt-1">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(event.startDate)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{event.location.name}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ticket Details */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{ticketType.name}</span>
                    <span>{formatPrice(ticketType.price)}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{ticketType.description}</p>
                  <div className="flex justify-between items-center text-sm">
                    <span>Cantitate:</span>
                    <span>{quantity}</span>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Comision platformă:</span>
                    <span>{formatPrice(commission)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>TVA (21%):</span>
                    <span>{formatPrice(vat)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Refund Policy */}
                <div className="text-xs text-gray-500 pt-4 border-t">
                  <p className="font-medium mb-1">Politica de returnare:</p>
                  <p>Biletele pot fi returnate până cu 24h înainte de eveniment pentru o taxă de 5%.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}