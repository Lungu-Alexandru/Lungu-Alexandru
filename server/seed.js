const database = require('./config/database');

// Script pentru a adăuga date de test în baza de date
const seedDatabase = () => {
  const db = database.getDb();

  console.log('🌱 Începe popularea bazei de date cu date de test...');

  // Evenimente de test
  const sampleEvents = [
    {
      titlu: 'Conferința Tech Innovation 2024',
      descriere: 'O conferință dedicată inovațiilor tehnologice și antreprenoriatului. Vei avea ocazia să îi întâlnești pe cei mai importanți lideri din industria tech și să afli despre cele mai noi tendințe.',
      descriere_scurta: 'Conferință despre inovațiile tehnologice și antreprenoriat',
      categorie: 'conferinta',
      data_start: '2024-09-15',
      ora: '09:00',
      locatie: 'Hotel Radisson Blu, București',
      pret: 250.00,
      capacitate: 200,
      status: 'viitor',
      vizualizari: 150,
      click_uri: 45
    },
    {
      titlu: 'Workshop Design Thinking',
      descriere: 'Un workshop practic despre metodologia Design Thinking. Vei învăța să aplici principiile design thinking-ului în proiectele tale și să dezvolți soluții inovatoare.',
      descriere_scurta: 'Workshop practic despre metodologia Design Thinking',
      categorie: 'workshop',
      data_start: '2024-08-28',
      ora: '10:00',
      locatie: 'Creative Hub, Cluj-Napoca',
      pret: 150.00,
      capacitate: 30,
      status: 'viitor',
      vizualizari: 89,
      click_uri: 23
    },
    {
      titlu: 'Networking Night pentru Antreprenori',
      descriere: 'O seară de networking dedicată antreprenorilor și startup-urilor. Conectează-te cu oameni din domeniul tău și construiește relații valoroase pentru afacerea ta.',
      descriere_scurta: 'Seară de networking pentru antreprenori și startup-uri',
      categorie: 'networking',
      data_start: '2024-08-25',
      ora: '18:00',
      locatie: 'The Ark, București',
      pret: 0,
      capacitate: 100,
      status: 'viitor',
      vizualizari: 234,
      click_uri: 67
    },
    {
      titlu: 'Concert Muzică Clasică - Enescu Festival',
      descriere: 'Un concert extraordinar în cadrul Festivalului Enescu, cu opere din repertoriul clasic român și internațional. O experiență muzicală de neuitat.',
      descriere_scurta: 'Concert de muzică clasică în cadrul Festivalului Enescu',
      categorie: 'concert',
      data_start: '2024-07-20',
      ora: '19:30',
      locatie: 'Ateneul Român, București',
      pret: 75.00,
      capacitate: 600,
      status: 'expirat',
      vizualizari: 456,
      click_uri: 123
    },
    {
      titlu: 'Seminar Marketing Digital',
      descriere: 'Seminar despre cele mai eficiente strategii de marketing digital pentru 2024. Vei învăța despre SEO, social media marketing, email marketing și multe altele.',
      descriere_scurta: 'Strategii eficiente de marketing digital pentru 2024',
      categorie: 'seminar',
      data_start: '2024-06-15',
      ora: '14:00',
      locatie: 'Business Garden, București',
      pret: 120.00,
      capacitate: 80,
      status: 'expirat',
      vizualizari: 178,
      click_uri: 34
    }
  ];

  // Adaugă evenimentele
  const insertEvent = (event) => {
    return new Promise((resolve, reject) => {
      db.run(`
        INSERT INTO evenimente (
          titlu, descriere, descriere_scurta, categorie, data_start, 
          ora, locatie, pret, capacitate, status, vizualizari, click_uri
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        event.titlu, event.descriere, event.descriere_scurta, event.categorie,
        event.data_start, event.ora, event.locatie, event.pret,
        event.capacitate, event.status, event.vizualizari, event.click_uri
      ], function(err) {
        if (err) {
          reject(err);
        } else {
          console.log(`✅ Eveniment adăugat: ${event.titlu}`);
          resolve(this.lastID);
        }
      });
    });
  };

  // Articole de test
  const sampleArticles = [
    {
      titlu: 'Cum să organizezi un eveniment de succes',
      continut: 'Organizarea unui eveniment de succes necesită planificare atentă și atenție la detalii. În acest articol, îți vom prezenta pașii esențiali pentru a organiza un eveniment memorabil.\n\nPrimul pas este definirea obiectivelor evenimentului. Ce vrei să realizezi? Vrei să educzi participanții, să îi distrezi sau să creezi oportunități de networking?\n\nAl doilea pas este stabilirea bugetului. Bugetul va determina multe dintre deciziile pe care le vei lua în continuare.\n\nAl treilea pas este alegerea locației potrivite. Locația trebuie să fie accesibilă, să aibă capacitatea necesară și să se potrivească cu atmosfera pe care vrei să o creezi.',
      rezumat: 'Ghid complet pentru organizarea unui eveniment de succes, cu pași practici și sfaturi utile.',
      status: 'publicat'
    },
    {
      titlu: 'Tendințele în organizarea de evenimente pentru 2024',
      continut: 'Industria evenimentelor evoluează rapid, iar 2024 aduce noi tendințe și inovații. Evenimentele hibride continuă să câștige popularitate, combinând experiențele fizice cu cele digitale.\n\nTehnologia joacă un rol din ce în ce mai important. Realitatea augmentată și virtuală sunt folosite pentru a crea experiențe imersive.\n\nSustenabilitatea devine o prioritate. Organizatorii caută modalități de a reduce impactul asupra mediului prin alegeri responsabile.\n\nPersonalizarea experiențelor pentru participanți devine esențială. Fiecare participant vrea să se simtă special și să primească conținut relevant pentru interesele sale.',
      rezumat: 'Descoperă cele mai importante tendințe în organizarea de evenimente pentru 2024.',
      status: 'publicat'
    },
    {
      titlu: 'Importanța feedback-ului în organizarea evenimentelor',
      continut: 'Feedback-ul participanților este esențial pentru îmbunătățirea continuă a evenimentelor. Prin colectarea și analizarea feedback-ului, poți identifica punctele forte și cele care necesită îmbunătățiri.\n\nExistă mai multe modalități de a colecta feedback: chestionare post-eveniment, interviuri, grupuri focus sau platforme digitale de rating.\n\nEste important să pui întrebările potrivite. Întreabă despre conținut, organizare, locație, catering și experiența generală.\n\nNu uita să acționezi pe baza feedback-ului primit. Participanții vor aprecia că părerile lor sunt luate în considerare.',
      rezumat: 'De ce este important feedback-ul și cum să îl folosești pentru îmbunătățirea evenimentelor.',
      status: 'publicat'
    }
  ];

  // Adaugă articolele
  const insertArticle = (article) => {
    return new Promise((resolve, reject) => {
      db.run(`
        INSERT INTO articole (titlu, continut, rezumat, status)
        VALUES (?, ?, ?, ?)
      `, [article.titlu, article.continut, article.rezumat, article.status], function(err) {
        if (err) {
          reject(err);
        } else {
          console.log(`✅ Articol adăugat: ${article.titlu}`);
          resolve(this.lastID);
        }
      });
    });
  };

  // Testimoniale de test
  const sampleTestimonials = [
    {
      nume: 'Maria Popescu',
      email: 'maria.popescu@email.com',
      mesaj: 'A fost o experiență fantastică! Organizarea a fost impecabilă și am învățat foarte multe lucruri noi. Recomand cu căldură evenimentele Vali Events!',
      rating: 5,
      status: 'aprobat'
    },
    {
      nume: 'Alexandru Ionescu',
      email: 'alex.ionescu@email.com',
      mesaj: 'Evenimentul a depășit așteptările mele. Networking-ul a fost excelent și am făcut conexiuni valoroase pentru afacerea mea.',
      rating: 5,
      status: 'aprobat'
    },
    {
      nume: 'Elena Radu',
      email: 'elena.radu@email.com',
      mesaj: 'Workshop-ul a fost foarte practic și aplicabil. Trainerii au fost profesioniști și au reușit să facă subiectul foarte interesant.',
      rating: 4,
      status: 'aprobat'
    },
    {
      nume: 'Mihai Stoica',
      email: 'mihai.stoica@email.com',
      mesaj: 'O experiență minunată! Locația a fost perfectă și organizarea de top. Cu siguranță voi participa la următoarele evenimente.',
      rating: 5,
      status: 'aprobat'
    },
    {
      nume: 'Ana Gheorghe',
      email: 'ana.gheorghe@email.com',
      mesaj: 'Concertul a fost magic! Atmosfera a fost incredibilă și interpretarea artiștilor a fost la cel mai înalt nivel.',
      rating: 5,
      status: 'aprobat'
    }
  ];

  // Adaugă testimonialele
  const insertTestimonial = (testimonial) => {
    return new Promise((resolve, reject) => {
      db.run(`
        INSERT INTO testimoniale (nume, email, mesaj, rating, status)
        VALUES (?, ?, ?, ?, ?)
      `, [testimonial.nume, testimonial.email, testimonial.mesaj, testimonial.rating, testimonial.status], function(err) {
        if (err) {
          reject(err);
        } else {
          console.log(`✅ Testimonial adăugat: ${testimonial.nume}`);
          resolve(this.lastID);
        }
      });
    });
  };

  // Abonați newsletter de test
  const sampleSubscribers = [
    { email: 'john.doe@email.com', nume: 'John Doe' },
    { email: 'jane.smith@email.com', nume: 'Jane Smith' },
    { email: 'contact@business.com', nume: 'Business Contact' },
    { email: 'info@startup.ro', nume: 'Startup Info' },
  ];

  // Adaugă abonații
  const insertSubscriber = (subscriber) => {
    return new Promise((resolve, reject) => {
      db.run(`
        INSERT INTO newsletter (email, nume, activ)
        VALUES (?, ?, 1)
      `, [subscriber.email, subscriber.nume], function(err) {
        if (err) {
          reject(err);
        } else {
          console.log(`✅ Abonat adăugat: ${subscriber.email}`);
          resolve(this.lastID);
        }
      });
    });
  };

  // Execută inserările
  const seedData = async () => {
    try {
      // Adaugă evenimente
      for (const event of sampleEvents) {
        await insertEvent(event);
      }

      // Adaugă articole
      for (const article of sampleArticles) {
        await insertArticle(article);
      }

      // Adaugă testimoniale
      for (const testimonial of sampleTestimonials) {
        await insertTestimonial(testimonial);
      }

      // Adaugă abonați
      for (const subscriber of sampleSubscribers) {
        await insertSubscriber(subscriber);
      }

      console.log('🎉 Baza de date a fost populată cu succes cu date de test!');
      console.log('\n📊 Rezumat:');
      console.log(`   - ${sampleEvents.length} evenimente adăugate`);
      console.log(`   - ${sampleArticles.length} articole adăugate`);
      console.log(`   - ${sampleTestimonials.length} testimoniale adăugate`);
      console.log(`   - ${sampleSubscribers.length} abonați adăugați`);
      console.log('\n🚀 Poți accesa aplicația la: http://localhost:3000');
      console.log('🔐 Admin panel: http://localhost:3000/admin (admin@vali-events.ro / admin123)');

    } catch (error) {
      console.error('❌ Eroare la popularea bazei de date:', error);
    }
  };

  seedData();
};

// Verifică dacă scriptul este rulat direct
if (require.main === module) {
  console.log('🌱 Popularea bazei de date cu date de test...');
  seedDatabase();
}

module.exports = seedDatabase;