const database = require('../config/database');
const { body, validationResult } = require('express-validator');

// Placeholder pentru integrarea Revolut
// În implementarea reală, aici ar fi integrată API-ul Revolut pentru plăți

const paymentController = {
    // Creează o plată nouă
    createPayment: async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Date invalide',
                    errors: errors.array()
                });
            }

            const { id_inscriere, suma, moneda = 'RON' } = req.body;
            const db = database.getDb();

            // Verifică dacă înscrierea există
            db.get('SELECT * FROM inscrieri WHERE id = ?', [id_inscriere], (err, registration) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: 'Eroare la verificarea înscrierii'
                    });
                }

                if (!registration) {
                    return res.status(404).json({
                        success: false,
                        message: 'Înscrierea nu a fost găsită'
                    });
                }

                // Verifică dacă plata nu există deja
                db.get('SELECT * FROM plati WHERE id_inscriere = ?', [id_inscriere], (err, existingPayment) => {
                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: 'Eroare la verificarea plății'
                        });
                    }

                    if (existingPayment) {
                        return res.status(400).json({
                            success: false,
                            message: 'Plata pentru această înscriere există deja'
                        });
                    }

                    // Generează ID tranzacție unic
                    const id_tranzactie = `VE_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

                    // Creează înregistrarea plății
                    db.run(`
                        INSERT INTO plati (id_inscriere, metoda_plata, suma, moneda, id_tranzactie, status)
                        VALUES (?, 'revolut', ?, ?, ?, 'in_asteptare')
                    `, [id_inscriere, suma, moneda, id_tranzactie], function(err) {
                        if (err) {
                            return res.status(500).json({
                                success: false,
                                message: 'Eroare la crearea plății'
                            });
                        }

                        // În implementarea reală, aici ar fi apelul către API-ul Revolut
                        // pentru a crea o cerere de plată
                        const revolutPaymentUrl = paymentController.createRevolutPaymentLink(
                            id_tranzactie, 
                            suma, 
                            moneda,
                            registration.nume_participant,
                            registration.email_participant
                        );

                        res.status(201).json({
                            success: true,
                            message: 'Cererea de plată a fost creată',
                            data: {
                                id_plata: this.lastID,
                                id_tranzactie,
                                suma,
                                moneda,
                                payment_url: revolutPaymentUrl,
                                status: 'in_asteptare'
                            }
                        });
                    });
                });
            });
        } catch (error) {
            console.error('Eroare la crearea plății:', error);
            res.status(500).json({
                success: false,
                message: 'Eroare internă de server'
            });
        }
    },

    // Verifică statusul unei plăți
    checkPaymentStatus: async (req, res) => {
        try {
            const { id_tranzactie } = req.params;
            const db = database.getDb();

            db.get(`
                SELECT p.*, i.nume_participant, i.email_participant, e.titlu as titlu_eveniment
                FROM plati p
                LEFT JOIN inscrieri i ON p.id_inscriere = i.id
                LEFT JOIN evenimente e ON i.id_eveniment = e.id
                WHERE p.id_tranzactie = ?
            `, [id_tranzactie], async (err, payment) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: 'Eroare la verificarea plății'
                    });
                }

                if (!payment) {
                    return res.status(404).json({
                        success: false,
                        message: 'Plata nu a fost găsită'
                    });
                }

                // În implementarea reală, aici ar fi apelul către API-ul Revolut
                // pentru a verifica statusul real al plății
                const revolutStatus = await paymentController.checkRevolutPaymentStatus(id_tranzactie);

                // Actualizează statusul în baza de date dacă s-a schimbat
                if (revolutStatus && revolutStatus !== payment.status) {
                    db.run('UPDATE plati SET status = ? WHERE id_tranzactie = ?', 
                        [revolutStatus, id_tranzactie]);
                    
                    // Actualizează și statusul înscrierii
                    if (revolutStatus === 'platit') {
                        db.run('UPDATE inscrieri SET status_plata = "platit" WHERE id = ?', 
                            [payment.id_inscriere]);
                        
                        // Trimite email de confirmare (implementat în registrationController)
                        // await sendPaymentConfirmationEmail(payment);
                    }
                }

                res.json({
                    success: true,
                    data: {
                        ...payment,
                        status: revolutStatus || payment.status
                    }
                });
            });
        } catch (error) {
            console.error('Eroare la verificarea statusului plății:', error);
            res.status(500).json({
                success: false,
                message: 'Eroare internă de server'
            });
        }
    },

    // Webhook pentru notificări de la Revolut
    revolutWebhook: async (req, res) => {
        try {
            const { event_type, payment_id, status, transaction_id } = req.body;
            const db = database.getDb();

            console.log('Webhook Revolut primit:', req.body);

            // Verifică semnătura webhook-ului (implementare de securitate)
            // const isValidSignature = paymentController.verifyRevolutSignature(req);
            // if (!isValidSignature) {
            //     return res.status(401).json({ error: 'Semnătură invalidă' });
            // }

            if (event_type === 'payment_completed' || event_type === 'payment_failed') {
                // Găsește plata în baza de date
                db.get('SELECT * FROM plati WHERE id_tranzactie = ?', [transaction_id], (err, payment) => {
                    if (err || !payment) {
                        console.error('Plata nu a fost găsită:', transaction_id);
                        return res.status(404).json({ error: 'Plata nu a fost găsită' });
                    }

                    const newStatus = event_type === 'payment_completed' ? 'platit' : 'esuat';

                    // Actualizează statusul plății
                    db.run('UPDATE plati SET status = ? WHERE id_tranzactie = ?', 
                        [newStatus, transaction_id], (err) => {
                        if (err) {
                            console.error('Eroare la actualizarea plății:', err);
                            return res.status(500).json({ error: 'Eroare la actualizare' });
                        }

                        // Actualizează statusul înscrierii
                        if (newStatus === 'platit') {
                            db.run('UPDATE inscrieri SET status_plata = "platit" WHERE id = ?', 
                                [payment.id_inscriere]);
                            
                            console.log(`Plata ${transaction_id} a fost confirmată cu succes`);
                        }

                        res.json({ success: true, message: 'Webhook procesat cu succes' });
                    });
                });
            } else {
                res.json({ success: true, message: 'Eveniment ignorat' });
            }
        } catch (error) {
            console.error('Eroare la procesarea webhook-ului:', error);
            res.status(500).json({ error: 'Eroare internă de server' });
        }
    },

    // Obține toate plățile (admin)
    getAllPayments: async (req, res) => {
        try {
            const { page = 1, limit = 20, status } = req.query;
            const db = database.getDb();
            const offset = (page - 1) * limit;

            let query = `
                SELECT p.*, i.nume_participant, i.email_participant, e.titlu as titlu_eveniment
                FROM plati p
                LEFT JOIN inscrieri i ON p.id_inscriere = i.id
                LEFT JOIN evenimente e ON i.id_eveniment = e.id
                WHERE 1=1
            `;
            let params = [];

            if (status) {
                query += ' AND p.status = ?';
                params.push(status);
            }

            query += ' ORDER BY p.data_plata DESC';
            query += ` LIMIT ${limit} OFFSET ${offset}`;

            db.all(query, params, (err, payments) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: 'Eroare la obținerea plăților'
                    });
                }

                // Obține numărul total pentru paginare
                let countQuery = 'SELECT COUNT(*) as total FROM plati WHERE 1=1';
                let countParams = [];

                if (status) {
                    countQuery += ' AND status = ?';
                    countParams.push(status);
                }

                db.get(countQuery, countParams, (err, countResult) => {
                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: 'Eroare la numărarea plăților'
                        });
                    }

                    res.json({
                        success: true,
                        data: payments,
                        pagination: {
                            currentPage: parseInt(page),
                            totalPages: Math.ceil(countResult.total / limit),
                            totalPayments: countResult.total
                        }
                    });
                });
            });
        } catch (error) {
            console.error('Eroare la obținerea plăților:', error);
            res.status(500).json({
                success: false,
                message: 'Eroare internă de server'
            });
        }
    },

    // Funcții helper pentru integrarea Revolut (placeholder)
    createRevolutPaymentLink: (transactionId, amount, currency, customerName, customerEmail) => {
        // În implementarea reală, aici ar fi apelul către API-ul Revolut
        // pentru a crea un link de plată
        
        // Placeholder URL pentru demonstrație
        const baseUrl = process.env.REVOLUT_PAYMENT_URL || 'https://sandbox-merchant.revolut.com/embed.js';
        const merchantId = process.env.REVOLUT_MERCHANT_ID || 'demo_merchant';
        
        // În realitate, ar trebui să generezi un token securizat
        return `${baseUrl}?merchant=${merchantId}&amount=${amount}&currency=${currency}&reference=${transactionId}`;
    },

    checkRevolutPaymentStatus: async (transactionId) => {
        // În implementarea reală, aici ar fi apelul către API-ul Revolut
        // pentru a verifica statusul plății
        
        try {
            // Simulare API call
            // const response = await fetch(`https://api.revolut.com/payments/${transactionId}`, {
            //     headers: {
            //         'Authorization': `Bearer ${process.env.REVOLUT_API_KEY}`,
            //         'Content-Type': 'application/json'
            //     }
            // });
            // const data = await response.json();
            // return data.status;
            
            // Pentru demonstrație, returnează statusul existent
            return null;
        } catch (error) {
            console.error('Eroare la verificarea statusului Revolut:', error);
            return null;
        }
    },

    verifyRevolutSignature: (req) => {
        // În implementarea reală, aici ar fi verificarea semnăturii webhook-ului
        // folosind cheia secretă de la Revolut
        
        // const signature = req.headers['revolut-signature'];
        // const payload = JSON.stringify(req.body);
        // const expectedSignature = crypto
        //     .createHmac('sha256', process.env.REVOLUT_WEBHOOK_SECRET)
        //     .update(payload)
        //     .digest('hex');
        // 
        // return signature === expectedSignature;
        
        // Pentru demonstrație, returnează true
        return true;
    },

    // Validări pentru plăți
    paymentValidation: [
        body('id_inscriere').isInt({ min: 1 }).withMessage('ID înregistrare invalid'),
        body('suma').isFloat({ min: 0.01 }).withMessage('Suma trebuie să fie mai mare de 0'),
        body('moneda').optional().isIn(['RON', 'EUR', 'USD']).withMessage('Monedă invalidă')
    ]
};

module.exports = paymentController;