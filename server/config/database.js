const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = process.env.DB_PATH || path.join(__dirname, '../database/events.db');

class Database {
    constructor() {
        this.db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.error('Eroare la conectarea la baza de date:', err.message);
            } else {
                console.log('Conectat la baza de date SQLite.');
                this.initializeTables();
            }
        });
    }

    initializeTables() {
        // Tabel Utilizatori
        this.db.run(`
            CREATE TABLE IF NOT EXISTS utilizatori (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nume TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                telefon TEXT,
                parola TEXT NOT NULL,
                rol TEXT DEFAULT 'client',
                data_creare DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Tabel Evenimente
        this.db.run(`
            CREATE TABLE IF NOT EXISTS evenimente (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                titlu TEXT NOT NULL,
                descriere TEXT NOT NULL,
                descriere_scurta TEXT,
                categorie TEXT NOT NULL,
                data_start DATE NOT NULL,
                data_final DATE,
                ora TIME NOT NULL,
                locatie TEXT NOT NULL,
                pret DECIMAL(10,2) DEFAULT 0,
                capacitate INTEGER,
                status TEXT DEFAULT 'viitor',
                imagine_principala TEXT,
                imagini TEXT,
                video_url TEXT,
                vizualizari INTEGER DEFAULT 0,
                click_uri INTEGER DEFAULT 0,
                data_creare DATETIME DEFAULT CURRENT_TIMESTAMP,
                data_modificare DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Tabel Înscrieri
        this.db.run(`
            CREATE TABLE IF NOT EXISTS inscrieri (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                id_eveniment INTEGER NOT NULL,
                id_utilizator INTEGER,
                nume_participant TEXT NOT NULL,
                email_participant TEXT NOT NULL,
                telefon_participant TEXT,
                status_plata TEXT DEFAULT 'in_asteptare',
                data_inscriere DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (id_eveniment) REFERENCES evenimente (id),
                FOREIGN KEY (id_utilizator) REFERENCES utilizatori (id)
            )
        `);

        // Tabel Plăți
        this.db.run(`
            CREATE TABLE IF NOT EXISTS plati (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                id_inscriere INTEGER NOT NULL,
                metoda_plata TEXT DEFAULT 'revolut',
                suma DECIMAL(10,2) NOT NULL,
                moneda TEXT DEFAULT 'RON',
                id_tranzactie TEXT UNIQUE,
                status TEXT DEFAULT 'in_asteptare',
                data_plata DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (id_inscriere) REFERENCES inscrieri (id)
            )
        `);

        // Tabel Articole/Blog
        this.db.run(`
            CREATE TABLE IF NOT EXISTS articole (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                titlu TEXT NOT NULL,
                continut TEXT NOT NULL,
                rezumat TEXT,
                imagine_principala TEXT,
                imagini TEXT,
                status TEXT DEFAULT 'publicat',
                data_publicare DATETIME DEFAULT CURRENT_TIMESTAMP,
                data_modificare DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Tabel Newsletter
        this.db.run(`
            CREATE TABLE IF NOT EXISTS newsletter (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                nume TEXT,
                activ BOOLEAN DEFAULT 1,
                data_abonare DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Tabel Testimoniale
        this.db.run(`
            CREATE TABLE IF NOT EXISTS testimoniale (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nume TEXT NOT NULL,
                email TEXT,
                mesaj TEXT NOT NULL,
                rating INTEGER DEFAULT 5,
                id_eveniment INTEGER,
                status TEXT DEFAULT 'aprobat',
                data_creare DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (id_eveniment) REFERENCES evenimente (id)
            )
        `);

        // Creez utilizatorul admin implicit
        this.createDefaultAdmin();
    }

    createDefaultAdmin() {
        const bcrypt = require('bcryptjs');
        const adminEmail = 'admin@vali-events.ro';
        const adminPassword = bcrypt.hashSync('admin123', 10);

        this.db.get('SELECT * FROM utilizatori WHERE email = ?', [adminEmail], (err, row) => {
            if (err) {
                console.error('Eroare la verificarea adminului:', err);
                return;
            }
            
            if (!row) {
                this.db.run(`
                    INSERT INTO utilizatori (nume, email, parola, rol)
                    VALUES (?, ?, ?, ?)
                `, ['Administrator', adminEmail, adminPassword, 'admin'], (err) => {
                    if (err) {
                        console.error('Eroare la crearea adminului:', err);
                    } else {
                        console.log('Administrator creat cu succes!');
                        console.log('Email: admin@vali-events.ro');
                        console.log('Parolă: admin123');
                    }
                });
            }
        });
    }

    getDb() {
        return this.db;
    }

    close() {
        this.db.close((err) => {
            if (err) {
                console.error('Eroare la închiderea bazei de date:', err.message);
            } else {
                console.log('Conexiunea la baza de date a fost închisă.');
            }
        });
    }
}

module.exports = new Database();