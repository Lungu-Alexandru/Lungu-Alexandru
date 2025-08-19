# Vali Events Platform

Platformă web modernă și optimizată pentru prezentarea și promovarea evenimentelor organizate de Vali, cu accent pe experiența utilizatorului, implicarea comunității și vânzarea rapidă a biletelor.

## 🚀 Funcționalități

### Pentru Vizitatori
- **Pagina principală** cu evenimente populare și testimoniale
- **Listă evenimente** cu filtrare avansată și căutare
- **Detalii evenimente** cu galerie foto/video și formular de înscriere
- **Blog/Noutăți** cu articole despre evenimente
- **Newsletter** pentru abonarea la noutăți
- **Testimoniale** și recenzii de la participanți

### Pentru Administratori
- **Panou de administrare** complet
- **Gestionarea evenimentelor** (CRUD)
- **Gestionarea articolelor** pentru blog
- **Gestionarea înscrierilor** și participanților
- **Sistem de newsletter** cu trimitere în masă
- **Gestionarea testimonialelor** cu moderare
- **Statistici** detaliate despre evenimente și participanți

### Funcționalități Tehnice
- **Design responsive** pentru toate dispozitivele
- **Sistem de plăți** integrat (pregătit pentru Revolut)
- **Upload imagini** pentru evenimente și articole
- **Sistem de autentificare** JWT
- **API RESTful** complet documentat
- **Bază de date SQLite** pentru portabilitate

## 🎨 Design

### Paleta de Culori
- **Albastru închis** `#0B3D91` - profesional și de încredere
- **Albastru deschis** `#4A90E2` - prietenos și deschis  
- **Portocaliu cald** `#F5A623` - accent vibrant pentru butoane și linkuri
- **Gri deschis** `#F2F2F2` - fundaluri și secțiuni neutre
- **Gri închis** `#4A4A4A` - text principal

### Tipografie
- **Titluri**: Montserrat (font puternic, sans-serif)
- **Text normal**: Open Sans (font lizibil, modern)

## 🛠️ Tehnologii Utilizate

### Backend
- **Node.js** cu Express.js
- **SQLite** pentru baza de date
- **JWT** pentru autentificare
- **Multer** pentru upload fișiere
- **Nodemailer** pentru trimiterea email-urilor
- **bcryptjs** pentru criptarea parolelor

### Frontend
- **React 18** cu TypeScript
- **Material-UI (MUI)** pentru componente UI
- **React Router** pentru navigare
- **Axios** pentru API calls
- **Context API** pentru state management

## 📦 Instalare și Configurare

### Prerequisite
- Node.js (versiunea 16 sau mai nouă)
- npm sau yarn

### 1. Clonează repository-ul
```bash
git clone <repository-url>
cd vali-events-platform
```

### 2. Instalează dependențele
```bash
# Instalează dependențele pentru backend și frontend
npm run install-all

# SAU instalează manual:
npm install
cd client && npm install
```

### 3. Configurează variabilele de mediu
Creează fișierul `.env` în root-ul proiectului:
```env
PORT=5000
JWT_SECRET=vali_events_super_secret_key_2024
DB_PATH=./server/database/events.db
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
REVOLUT_API_KEY=your_revolut_api_key
NODE_ENV=development
```

### 4. Pornește aplicația
```bash
# Pentru development (rulează backend și frontend simultan)
npm run dev

# SAU pornește separat:
npm run server  # Backend pe portul 5000
npm run client  # Frontend pe portul 3000
```

### 5. Accesează aplicația
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Admin Panel**: http://localhost:3000/admin

## 👤 Cont Administrator Implicit

Pentru a accesa panoul de administrare, folosește:
- **Email**: admin@vali-events.ro
- **Parolă**: admin123

⚠️ **Important**: Schimbă parola administratorului după prima autentificare!

## 📊 Structura Bazei de Date

### Tabele Principale
- **utilizatori** - Conturi utilizatori și administratori
- **evenimente** - Informații despre evenimente
- **inscrieri** - Înregistrări la evenimente
- **plati** - Tranzacții și plăți
- **articole** - Articole pentru blog
- **newsletter** - Abonați la newsletter
- **testimoniale** - Recenzii și testimoniale

## 🔧 API Endpoints

### Autentificare
- `POST /api/auth/login` - Autentificare
- `POST /api/auth/register` - Înregistrare

### Evenimente
- `GET /api/events` - Lista evenimente (cu filtrare)
- `GET /api/events/popular` - Top 3 evenimente populare
- `GET /api/events/:id` - Detalii eveniment
- `POST /api/events` - Creează eveniment (admin)
- `PUT /api/events/:id` - Actualizează eveniment (admin)
- `DELETE /api/events/:id` - Șterge eveniment (admin)

### Înregistrări
- `POST /api/registrations/events/:id/register` - Înregistrare la eveniment
- `GET /api/registrations` - Lista înscrieri (admin)
- `PUT /api/registrations/:id/status` - Actualizează status înscriere (admin)

### Blog
- `GET /api/blog` - Lista articole
- `GET /api/blog/latest` - Ultimele articole
- `GET /api/blog/:id` - Detalii articol
- `POST /api/blog` - Creează articol (admin)
- `PUT /api/blog/:id` - Actualizează articol (admin)
- `DELETE /api/blog/:id` - Șterge articol (admin)

### Newsletter
- `POST /api/newsletter/subscribe` - Abonare
- `POST /api/newsletter/unsubscribe` - Dezabonare
- `GET /api/newsletter/subscribers` - Lista abonați (admin)
- `POST /api/newsletter/send` - Trimite newsletter (admin)

### Testimoniale
- `GET /api/testimonials` - Testimoniale aprobate
- `POST /api/testimonials` - Adaugă testimonial
- `GET /api/testimonials/all` - Toate testimonialele (admin)
- `PUT /api/testimonials/:id/status` - Actualizează status (admin)

## 🚀 Deployment

### Pentru producție
```bash
# Build frontend
cd client && npm run build

# Pornește serverul în modul producție
NODE_ENV=production npm start
```

### Variabile de mediu pentru producție
```env
NODE_ENV=production
PORT=80
JWT_SECRET=your_super_secret_jwt_key
# ... alte configurări
```

## 🔒 Securitate

- **JWT** pentru autentificare
- **bcryptjs** pentru criptarea parolelor
- **Helmet.js** pentru securitatea header-urilor
- **Rate limiting** pentru protecție împotriva spam-ului
- **Validare** completă a input-urilor
- **Sanitizare** a datelor utilizatorilor

## 📱 Responsive Design

Aplicația este complet optimizată pentru:
- **Desktop** (1200px+)
- **Tablet** (768px - 1199px)
- **Mobile** (până la 767px)

## 🤝 Contribuții

Pentru a contribui la proiect:
1. Fork repository-ul
2. Creează o ramură nouă pentru feature-ul tău
3. Commit modificările
4. Push la ramura ta
5. Deschide un Pull Request

## 📄 Licență

Acest proiect este licențiat sub licența MIT - vezi fișierul LICENSE pentru detalii.

## 📞 Support

Pentru întrebări sau probleme:
- **Email**: contact@vali-events.ro
- **Telefon**: +40 123 456 789

## 🎯 Roadmap

### Funcționalități Viitoare
- [ ] Integrare completă Revolut pentru plăți
- [ ] Sistem de badge-uri pentru participanți frecvenți
- [ ] Aplicație mobilă (React Native)
- [ ] Sistem de recomandări evenimente
- [ ] Integrare rețele sociale
- [ ] Chat live pentru support
- [ ] Sistem de rating pentru evenimente
- [ ] Export date în Excel/PDF
- [ ] Notificări push
- [ ] Sistem de cupoane și reduceri

---

Dezvoltat cu ❤️ pentru comunitatea Vali Events