const database = require('../config/database');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');

const newsletterController = {
    // Abonare la newsletter
    subscribe: (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Date invalide',
                errors: errors.array()
            });
        }

        const { email, nume } = req.body;
        const db = database.getDb();

        // Verifică dacă email-ul există deja
        db.get('SELECT * FROM newsletter WHERE email = ?', [email], (err, row) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Eroare la verificarea abonamentului'
                });
            }

            if (row) {
                if (row.activ) {
                    return res.status(400).json({
                        success: false,
                        message: 'Acest email este deja abonat'
                    });
                } else {
                    // Reactivează abonamentul
                    db.run('UPDATE newsletter SET activ = 1, data_abonare = CURRENT_TIMESTAMP WHERE email = ?', [email], (err) => {
                        if (err) {
                            return res.status(500).json({
                                success: false,
                                message: 'Eroare la reactivarea abonamentului'
                            });
                        }

                        res.json({
                            success: true,
                            message: 'Abonament reactivat cu succes'
                        });
                    });
                    return;
                }
            }

            // Adaugă abonament nou
            db.run(`
                INSERT INTO newsletter (email, nume, activ)
                VALUES (?, ?, 1)
            `, [email, nume || null], function(err) {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: 'Eroare la abonarea la newsletter'
                    });
                }

                // Trimite email de bun venit
                newsletterController.sendWelcomeEmail(email, nume);

                res.status(201).json({
                    success: true,
                    message: 'Abonare reușită la newsletter'
                });
            });
        });
    },

    // Dezabonare de la newsletter
    unsubscribe: (req, res) => {
        const { email } = req.body;
        const db = database.getDb();

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email-ul este obligatoriu'
            });
        }

        db.run('UPDATE newsletter SET activ = 0 WHERE email = ?', [email], function(err) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Eroare la dezabonare'
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Email-ul nu a fost găsit în lista de abonați'
                });
            }

            res.json({
                success: true,
                message: 'Dezabonare reușită'
            });
        });
    },

    // Obține lista abonați (doar admin)
    getSubscribers: (req, res) => {
        const { page = 1, limit = 50, activ = 'true' } = req.query;
        const db = database.getDb();
        const offset = (page - 1) * limit;

        let query = 'SELECT * FROM newsletter';
        let params = [];

        if (activ === 'true') {
            query += ' WHERE activ = 1';
        } else if (activ === 'false') {
            query += ' WHERE activ = 0';
        }

        query += ' ORDER BY data_abonare DESC';
        query += ` LIMIT ${limit} OFFSET ${offset}`;

        db.all(query, params, (err, subscribers) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Eroare la obținerea abonațiilor'
                });
            }

            // Obține numărul total pentru paginare
            let countQuery = 'SELECT COUNT(*) as total FROM newsletter';
            if (activ === 'true') {
                countQuery += ' WHERE activ = 1';
            } else if (activ === 'false') {
                countQuery += ' WHERE activ = 0';
            }

            db.get(countQuery, (err, countResult) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: 'Eroare la numărarea abonațiilor'
                    });
                }

                res.json({
                    success: true,
                    data: subscribers,
                    pagination: {
                        currentPage: parseInt(page),
                        totalPages: Math.ceil(countResult.total / limit),
                        totalSubscribers: countResult.total
                    }
                });
            });
        });
    },

    // Trimite newsletter către toți abonații (doar admin)
    sendNewsletter: async (req, res) => {
        const { subject, content, html_content } = req.body;
        
        if (!subject || !content) {
            return res.status(400).json({
                success: false,
                message: 'Subiectul și conținutul sunt obligatorii'
            });
        }

        const db = database.getDb();

        // Obține toți abonații activi
        db.all('SELECT email, nume FROM newsletter WHERE activ = 1', async (err, subscribers) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Eroare la obținerea abonațiilor'
                });
            }

            if (subscribers.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Nu există abonați activi'
                });
            }

            try {
                const results = await newsletterController.sendBulkEmails(
                    subscribers, 
                    subject, 
                    content, 
                    html_content
                );

                res.json({
                    success: true,
                    message: `Newsletter trimis către ${results.success} din ${results.total} abonați`,
                    data: results
                });
            } catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Eroare la trimiterea newsletter-ului'
                });
            }
        });
    },

    // Trimite email de bun venit
    sendWelcomeEmail: async (email, nume) => {
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
                subject: 'Bun venit la Newsletter-ul Vali Events!',
                html: `
                    <h2>Bun venit la Newsletter-ul Vali Events!</h2>
                    <p>Salut ${nume || 'Prieten'},</p>
                    <p>Mulțumim că te-ai abonat la newsletter-ul nostru!</p>
                    <p>Vei primi notificări despre:</p>
                    <ul>
                        <li>Evenimente noi și interesante</li>
                        <li>Oferte speciale și reduceri</li>
                        <li>Noutăți din comunitatea noastră</li>
                        <li>Sfaturi și resurse utile</li>
                    </ul>
                    <p>Ne bucurăm să te avem alături!</p>
                    <p>Echipa Vali Events</p>
                    <hr>
                    <p><small>Dacă vrei să te dezabonezi, <a href="#">click aici</a></small></p>
                `
            };

            await transporter.sendMail(mailOptions);
            console.log(`Email de bun venit trimis la ${email}`);
        } catch (error) {
            console.error('Eroare la trimiterea emailului de bun venit:', error);
        }
    },

    // Trimite email-uri în masă
    sendBulkEmails: async (subscribers, subject, content, html_content) => {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            throw new Error('Configurația email lipsește');
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

        let successCount = 0;
        let errorCount = 0;
        const errors = [];

        for (const subscriber of subscribers) {
            try {
                const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: subscriber.email,
                    subject: subject,
                    text: content,
                    html: html_content || `
                        <div>
                            <h2>${subject}</h2>
                            <p>Salut ${subscriber.nume || 'Prieten'},</p>
                            <div>${content.replace(/\n/g, '<br>')}</div>
                            <hr>
                            <p>Echipa Vali Events</p>
                            <p><small>Dacă vrei să te dezabonezi, <a href="#">click aici</a></small></p>
                        </div>
                    `
                };

                await transporter.sendMail(mailOptions);
                successCount++;
                
                // Pauză mică între email-uri pentru a evita spam
                await new Promise(resolve => setTimeout(resolve, 100));
            } catch (error) {
                errorCount++;
                errors.push({
                    email: subscriber.email,
                    error: error.message
                });
                console.error(`Eroare la trimiterea email-ului către ${subscriber.email}:`, error);
            }
        }

        return {
            total: subscribers.length,
            success: successCount,
            errors: errorCount,
            errorDetails: errors
        };
    },

    // Validări pentru abonare
    subscribeValidation: [
        body('email').isEmail().withMessage('Email invalid'),
        body('nume').optional().isLength({ min: 2 }).withMessage('Numele trebuie să aibă minim 2 caractere')
    ]
};

module.exports = newsletterController;