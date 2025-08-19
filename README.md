# Gettiks - Modern Web Ticketing Platform

Gettiks is a comprehensive, scalable web ticketing platform built with modern technologies. It connects event organizers with participants through a secure, user-friendly interface.

## 🚀 Features

### For Users
- **Event Discovery**: Browse and search thousands of events across multiple categories
- **Secure Payments**: Stripe integration with support for cards, Apple Pay, and Google Pay
- **Digital Tickets**: QR code-based tickets with secure validation
- **User Dashboard**: Manage tickets, favorites, and account settings
- **Multi-language Support**: Romanian, English, and Italian
- **Mobile-First Design**: Responsive design optimized for all devices

### For Organizers
- **Event Management**: Create and manage events with rich media support
- **Ticket Types**: Multiple ticket categories (Standard, Early Bird, VIP, Invitations)
- **Seat Selection**: Theater-style seating for venues that require it
- **Promotion Tools**: Banners, videos, articles, and social media integration
- **Analytics Dashboard**: Real-time sales data and audience insights
- **Commission System**: Flexible pricing with automatic commission calculation

### For Administrators
- **Content Moderation**: Approve/reject events and manage platform content
- **User Management**: Comprehensive user and organizer management
- **Analytics**: Platform-wide statistics and reporting
- **Security**: Advanced security rules and monitoring

## 🛠 Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **React Hook Form** - Form handling and validation

### Backend
- **Firebase** - Complete backend-as-a-service
  - **Firestore** - NoSQL database
  - **Authentication** - Multi-provider auth (Email, Google, Facebook, Apple)
  - **Cloud Functions** - Serverless backend logic
  - **Storage** - File and media storage
  - **Hosting** - Fast, secure web hosting

### Integrations
- **Stripe** - Payment processing
- **Google Maps API** - Location services
- **Firebase Analytics** - User behavior tracking
- **Nodemailer** - Email notifications

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- Firebase CLI installed (`npm install -g firebase-tools`)
- A Firebase project created
- Stripe account for payments
- Google Maps API key

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/gettiks-platform.git
cd gettiks-platform
```

### 2. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install Firebase Functions dependencies
cd functions
npm install
cd ..
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin SDK
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key\n-----END PRIVATE KEY-----\n"
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project.iam.gserviceaccount.com
FIREBASE_ADMIN_PROJECT_ID=your_project_id

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
STRIPE_SECRET_KEY=sk_test_your_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Google Maps API
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_COMPANY_NAME="Gettiks"
NEXT_PUBLIC_COMPANY_EMAIL=support@gettiks.com
```

### 4. Firebase Setup

```bash
# Login to Firebase
firebase login

# Initialize Firebase (if not already done)
firebase init

# Deploy Firestore rules and indexes
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes

# Deploy Storage rules
firebase deploy --only storage

# Deploy Firebase Functions
firebase deploy --only functions
```

### 5. Start Development Server

```bash
# Start the Next.js development server
npm run dev

# In another terminal, start Firebase emulators (optional)
firebase emulators:start
```

The application will be available at `http://localhost:3000`.

## 🏗 Project Structure

```
gettiks-platform/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── auth/              # Authentication pages
│   │   ├── events/            # Event pages
│   │   ├── dashboard/         # User dashboard
│   │   └── api/               # API routes
│   ├── components/            # React components
│   │   ├── ui/               # Reusable UI components
│   │   ├── layout/           # Layout components
│   │   ├── auth/             # Authentication components
│   │   └── events/           # Event-specific components
│   ├── contexts/             # React contexts
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utility libraries
│   ├── types/                # TypeScript type definitions
│   └── styles/               # Global styles
├── functions/                 # Firebase Cloud Functions
│   └── src/
│       ├── functions/        # Cloud Function definitions
│       ├── routes/           # API route handlers
│       ├── middleware/       # Express middleware
│       └── validators/       # Request validators
├── public/                   # Static assets
└── firestore.rules          # Firestore security rules
```

## 🎯 Key Features Implementation

### Event Categories

The platform supports 10 main event categories:

1. **Music & Concerts** - Live concerts, festivals, DJ sets
2. **Theater & Performing Arts** - Theater, comedy, dance, opera
3. **Film & Screenings** - Movie premieres, film festivals
4. **Sports** - Football, basketball, tennis, martial arts
5. **Conferences & Education** - Business conferences, workshops
6. **Exhibitions & Fairs** - Art exhibitions, trade fairs
7. **Parties & Nightlife** - Clubbing, private events
8. **Family & Kids** - Children's theater, educational workshops
9. **Outdoor & Experiences** - Hiking, camping, escape rooms
10. **Cultural & Religious** - Cultural festivals, community events

### Ticket Types

- **Standard** - Regular event tickets
- **Early Bird** - Discounted tickets for early purchases
- **VIP** - Premium experience with additional benefits
- **Invitations** - Free tickets for media, sponsors, etc.
- **Day Pass** - Single day access for multi-day events
- **Season Pass** - Multiple day packages (2-10 days)

### Commission System

- **4% platform commission** + 21% VAT on all ticket sales
- Automatic calculation and transparent pricing
- Organizers can offer discounts (5-100%) while commission applies to original price
- 100% discount = invitation (no commission)

### Promotion System

Organizers can purchase promotional add-ons:

- **Social Media Links** - €15 + VAT (unlimited) or €3 + VAT per link
- **Video Links** - €20 + VAT (unlimited) or €5 + VAT per link  
- **Banner Graphics** - €20 + VAT (3 banners, carousel, 5s delay)
- **Video Banners** - €30 + VAT (3 videos, 10s each, carousel)
- **Articles/Press** - €5 + VAT (up to 10), €3 + VAT (over 10)
- **Website Link** - Free

## 🔒 Security

### Firebase Security Rules

The platform implements comprehensive security rules:

- **User data isolation** - Users can only access their own data
- **Role-based access** - Different permissions for users, organizers, and admins
- **Event ownership** - Organizers can only manage their own events
- **Ticket validation** - Secure QR code generation and validation

### Payment Security

- **PCI DSS compliance** through Stripe
- **No card data storage** - All payment data handled by Stripe
- **Secure webhooks** with signature verification
- **Rate limiting** to prevent abuse

## 📱 Mobile Optimization

- **Progressive Web App** (PWA) capabilities
- **Responsive design** for all screen sizes
- **Touch-friendly interface** optimized for mobile use
- **Fast loading** with Next.js optimization
- **Offline capabilities** for ticket viewing

## 🌐 Deployment

### Production Deployment

1. **Build the application:**
```bash
npm run build
```

2. **Deploy to Firebase Hosting:**
```bash
firebase deploy --only hosting
```

3. **Deploy Functions:**
```bash
firebase deploy --only functions
```

### Environment Variables for Production

Update your environment variables for production:

- Use production Firebase project
- Use live Stripe keys
- Set production domain URLs
- Configure production email settings

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- Email: support@gettiks.com
- Documentation: [docs.gettiks.com](https://docs.gettiks.com)
- Issues: [GitHub Issues](https://github.com/your-username/gettiks-platform/issues)

## 🙏 Acknowledgments

- Built with ❤️ by the Gettiks team
- Powered by [Genium Soft](https://genium-soft.com)
- Icons by [Lucide](https://lucide.dev)
- Images from [Unsplash](https://unsplash.com)

---

**Gettiks** - Connecting events with people, one ticket at a time. 🎫