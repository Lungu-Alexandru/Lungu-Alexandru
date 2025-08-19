const database = require('../config/database');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');

const registrationController = {
    // Înscrie un participant la un eveniment
    registerForEvent: (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Date invalide',
                errors: errors.array()
            });
        }

        const { id_eveniment } = req.params;
        const { nume_participant, email_participant, telefon_participant } = req.body;
        const id_utilizator = req.user ? req.user.id : null;
        const db = database.getDb();

        // Verifică dacă evenimentul există și este activ
        db.get('SELECT * FROM evenimente WHERE id = ? AND status = "viitor"', [id_eveniment], (err, event) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Eroare la verificarea evenimentului'
                });
            }

            if (!event) {
                return res.status(404).json({
                    success: false,
                    message: 'Evenimentul nu a fost găsit sau nu este disponibil'
                });
            }

            // Verifică capacitatea
            db.get(`
                SELECT COUNT(*) as inscrisi FROM inscrieri 
                WHERE id_eveniment = ? AND status_plata IN ('platit', 'in_asteptare')
            `, [id_eveniment], (err, countResult) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: 'Eroare la verificarea capacității'
                    });
                }

                if (event.capacitate && countResult.inscrisi >= event.capacitate) {
                    return res.status(400).json({
                        success: false,
                        message: 'Evenimentul este complet'
                    });
                }

                // Verifică dacă participantul nu este deja înscris
                db.get(`
                    SELECT * FROM inscrieri 
                    WHERE id_eveniment = ? AND email_participant = ?
                `, [id_eveniment, email_participant], (err, existingRegistration) => {
                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: 'Eroare la verificarea înscrierii'
                        });
                    }

                    if (existingRegistration) {
                        return res.status(400).json({
                            success: false,
                            message: 'Sunteți deja înscris la acest eveniment'
                        });
                    }

                    // Creează înscrierea
                    db.run(`
                        INSERT INTO inscrieri (
                            id_eveniment, id_utilizator, nume_participant, 
                            email_participant, telefon_participant, status_plata
                        ) VALUES (?, ?, ?, ?, ?, ?)
                    `, [
                        id_eveniment, id_utilizator, nume_participant,
                        email_participant, telefon_participant,
                        event.pret > 0 ? 'in_asteptare' : 'gratuit'
                    ], function(err) {
                        if (err) {
                            return res.status(500).json({
                                success: false,
                                message: 'Eroare la înregistrarea participantului'
                            });
                        }

                        // Trimite email de confirmare
                        registrationController.sendConfirmationEmail(
                            email_participant, 
                            nume_participant, 
                            event
                        );

                        res.status(201).json({
                            success: true,
                            message: 'Înregistrare reușită',
                            data: {
                                id_inscriere: this.lastID,
                                necesita_plata: event.pret > 0,
                                suma: event.pret
                            }
                        });
                    });
                });
            });
        });
    },

    // Obține înscrierile pentru un eveniment (doar admin)
    getEventRegistrations: (req, res) => {
        const { id_eveniment } = req.params;
        const db = database.getDb();

        db.all(`
            SELECT i.*, e.titlu as titlu_eveniment, p.suma, p.status as status_plata_detalii
            FROM inscrieri i
            LEFT JOIN evenimente e ON i.id_eveniment = e.id
            LEFT JOIN plati p ON i.id = p.id_inscriere
            WHERE i.id_eveniment = ?
            ORDER BY i.data_inscriere DESC
        `, [id_eveniment], (err, registrations) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Eroare la obținerea înscrierilor'
                });
            }

            res.json({
                success: true,
                data: registrations
            });
        });
    },

    // Obține toate înscrierile (doar admin)
    getAllRegistrations: (req, res) => {
        const { page = 1, limit = 20 } = req.query;
        const db = database.getDb();
        const offset = (page - 1) * limit;

        db.all(`
            SELECT i.*, e.titlu as titlu_eveniment, e.data_start, p.suma, p.status as status_plata_detalii
            FROM inscrieri i
            LEFT JOIN evenimente e ON i.id_eveniment = e.id
            LEFT JOIN plati p ON i.id = p.id_inscriere
            ORDER BY i.data_inscriere DESC
            LIMIT ${limit} OFFSET ${offset}
        `, (err, registrations) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Eroare la obținerea înscrierilor'
                });
            }

            // Obține numărul total pentru paginare
            db.get('SELECT COUNT(*) as total FROM inscrieri', (err, countResult) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: 'Eroare la numărarea înscrierilor'
                    });
                }

                res.json({
                    success: true,
                    data: registrations,
                    pagination: {
                        currentPage: parseInt(page),
                        totalPages: Math.ceil(countResult.total / limit),
                        totalRegistrations: countResult.total
                    }
                });
            });
        });
    },

    // Actualizează statusul unei înscrieri (doar admin)
    updateRegistrationStatus: (req, res) => {
        const { id } = req.params;
        const { status_plata } = req.body;
        const db = database.getDb();

        const statusuriValide = ['in_asteptare', 'platit', 'anulat', 'gratuit'];
        if (!statusuriValide.includes(status_plata)) {
            return res.status(400).json({
                success: false,
                message: 'Status invalid'
            });
        }

        db.run(`
            UPDATE inscrieri SET status_plata = ? WHERE id = ?
        `, [status_plata, id], function(err) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Eroare la actualizarea statusului'
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Înscrierea nu a fost găsită'
                });
            }

            res.json({
                success: true,
                message: 'Status actualizat cu succes'
            });
        });
    },

    // Trimite email de confirmare
    sendConfirmationEmail: async (email, nume, event) => {
        try {
            if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
                console.log('Configurația email lipsește - nu se poate trimite emailul');
                return;
            }

            const transporter = nodemailer.createTransporter({
                host: process.env.EMAIL_HOST,
                port: process.env.EMAIL_PORT,
                secure: false,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: `Confirmare înregistrare - ${event.titlu}`,
                html: `
                    <h2>Confirmare înregistrare</h2>
                    <p>Bună ${nume},</p>
                    <p>Înregistrarea ta la evenimentul <strong>${event.titlu}</strong> a fost confirmată!</p>
                    <h3>Detalii eveniment:</h3>
                    <ul>
                        <li><strong>Data:</strong> ${event.data_start}</li>
                        <li><strong>Ora:</strong> ${event.ora}</li>
                        <li><strong>Locația:</strong> ${event.locatie}</li>
                        ${event.pret > 0 ? `<li><strong>Preț:</strong> ${event.pret} RON</li>` : ''}
                    </ul>
                    <p>Ne vedem la eveniment!</p>
                    <p>Echipa Vali Events</p>
                `
            };

            await transporter.sendMail(mailOptions);
            console.log(`Email de confirmare trimis la ${email}`);
        } catch (error) {
            console.error('Eroare la trimiterea emailului:', error);
        }
    },

    // Validări pentru înregistrare
    registrationValidation: [
        body('nume_participant').notEmpty().withMessage('Numele participantului este obligatoriu'),
        body('email_participant').isEmail().withMessage('Email invalid'),
        body('telefon_participant').optional().isMobilePhone('ro-RO').withMessage('Număr de telefon invalid')
    ]
};

module.exports = registrationController;