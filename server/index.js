const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

// Import rute
const authRoutes = require('./routes/auth');
const eventsRoutes = require('./routes/events');
const registrationsRoutes = require('./routes/registrations');
const blogRoutes = require('./routes/blog');
const newsletterRoutes = require('./routes/newsletter');
const testimonialsRoutes = require('./routes/testimonials');
const paymentsRoutes = require('./routes/payments');

// Inițializează baza de date
const database = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware de securitate
app.use(helmet({
    contentSecurityPolicy: false, // Dezactivat pentru development
    crossOriginResourcePolicy: false
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minute
    max: 100, // Limitează la 100 request-uri per IP per 15 minute
    message: {
        success: false,
        message: 'Prea multe request-uri. Încearcă din nou mai târziu.'
    }
});
app.use('/api/', limiter);

// CORS
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://your-domain.com'] 
        : ['http://localhost:3000'],
    credentials: true
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servește fișierele statice
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rute API
app.use('/api/auth', authRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/registrations', registrationsRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/payments', paymentsRoutes);

// Rută pentru verificarea stării serverului
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server funcționează corect',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Servește aplicația React în producție
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
    
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/build/index.html'));
    });
}

// Middleware pentru gestionarea erorilor
app.use((err, req, res, next) => {
    console.error('Eroare server:', err);
    
    // Erori multer (upload fișiere)
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'Fișierul este prea mare. Mărimea maximă permisă este 5MB.'
            });
        }
    }
    
    // Erori de validare
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            message: 'Date invalide',
            errors: err.errors
        });
    }
    
    // Eroare generică
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Eroare internă de server'
    });
});

// Middleware pentru rute inexistente
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Ruta nu a fost găsită'
    });
});

// Pornește serverul
app.listen(PORT, () => {
    console.log(`🚀 Serverul rulează pe portul ${PORT}`);
    console.log(`📊 Panou admin: http://localhost:${PORT}/admin`);
    console.log(`🌐 API: http://localhost:${PORT}/api`);
    
    if (process.env.NODE_ENV === 'development') {
        console.log(`👤 Admin login:`);
        console.log(`   Email: admin@vali-events.ro`);
        console.log(`   Parolă: admin123`);
    }
});

// Gestionarea închiderii aplicației
process.on('SIGINT', () => {
    console.log('\n🛑 Închiderea serverului...');
    database.close();
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Închiderea serverului...');
    database.close();
    process.exit(0);
});

module.exports = app;