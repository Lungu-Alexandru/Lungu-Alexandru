const database = require('../config/database');
const { body, validationResult } = require('express-validator');

const testimonialsController = {
    // Obține toate testimonialele aprobate
    getApprovedTestimonials: (req, res) => {
        const { limit = 10, id_eveniment } = req.query;
        const db = database.getDb();

        let query = `
            SELECT t.*, e.titlu as titlu_eveniment 
            FROM testimoniale t
            LEFT JOIN evenimente e ON t.id_eveniment = e.id
            WHERE t.status = 'aprobat'
        `;
        let params = [];

        if (id_eveniment) {
            query += ' AND t.id_eveniment = ?';
            params.push(id_eveniment);
        }

        query += ' ORDER BY t.data_creare DESC';
        
        if (limit) {
            query += ` LIMIT ${parseInt(limit)}`;
        }

        db.all(query, params, (err, testimonials) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Eroare la obținerea testimonialelor'
                });
            }

            res.json({
                success: true,
                data: testimonials
            });
        });
    },

    // Obține toate testimonialele (doar admin)
    getAllTestimonials: (req, res) => {
        const { page = 1, limit = 20, status } = req.query;
        const db = database.getDb();
        const offset = (page - 1) * limit;

        let query = `
            SELECT t.*, e.titlu as titlu_eveniment 
            FROM testimoniale t
            LEFT JOIN evenimente e ON t.id_eveniment = e.id
            WHERE 1=1
        `;
        let params = [];

        if (status) {
            query += ' AND t.status = ?';
            params.push(status);
        }

        query += ' ORDER BY t.data_creare DESC';
        query += ` LIMIT ${limit} OFFSET ${offset}`;

        db.all(query, params, (err, testimonials) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Eroare la obținerea testimonialelor'
                });
            }

            // Obține numărul total pentru paginare
            let countQuery = 'SELECT COUNT(*) as total FROM testimoniale WHERE 1=1';
            let countParams = [];

            if (status) {
                countQuery += ' AND status = ?';
                countParams.push(status);
            }

            db.get(countQuery, countParams, (err, countResult) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: 'Eroare la numărarea testimonialelor'
                    });
                }

                res.json({
                    success: true,
                    data: testimonials,
                    pagination: {
                        currentPage: parseInt(page),
                        totalPages: Math.ceil(countResult.total / limit),
                        totalTestimonials: countResult.total
                    }
                });
            });
        });
    },

    // Adaugă un testimonial nou
    createTestimonial: (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Date invalide',
                errors: errors.array()
            });
        }

        const { nume, email, mesaj, rating, id_eveniment } = req.body;
        const db = database.getDb();

        // Verifică dacă evenimentul există (dacă este specificat)
        if (id_eveniment) {
            db.get('SELECT * FROM evenimente WHERE id = ?', [id_eveniment], (err, event) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: 'Eroare la verificarea evenimentului'
                    });
                }

                if (!event) {
                    return res.status(404).json({
                        success: false,
                        message: 'Evenimentul specificat nu există'
                    });
                }

                // Creează testimonialul
                createTestimonialRecord();
            });
        } else {
            createTestimonialRecord();
        }

        function createTestimonialRecord() {
            db.run(`
                INSERT INTO testimoniale (nume, email, mesaj, rating, id_eveniment, status)
                VALUES (?, ?, ?, ?, ?, 'in_asteptare')
            `, [nume, email, mesaj, rating || 5, id_eveniment || null], function(err) {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: 'Eroare la crearea testimonialului'
                    });
                }

                res.status(201).json({
                    success: true,
                    message: 'Testimonial trimis cu succes. Va fi revizuit înainte de publicare.',
                    data: {
                        id: this.lastID
                    }
                });
            });
        }
    },

    // Actualizează statusul unui testimonial (doar admin)
    updateTestimonialStatus: (req, res) => {
        const { id } = req.params;
        const { status } = req.body;
        const db = database.getDb();

        const statusuriValide = ['in_asteptare', 'aprobat', 'respins'];
        if (!statusuriValide.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Status invalid'
            });
        }

        db.run(`
            UPDATE testimoniale SET status = ? WHERE id = ?
        `, [status, id], function(err) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Eroare la actualizarea statusului'
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Testimonialul nu a fost găsit'
                });
            }

            res.json({
                success: true,
                message: 'Status actualizat cu succes'
            });
        });
    },

    // Șterge un testimonial (doar admin)
    deleteTestimonial: (req, res) => {
        const { id } = req.params;
        const db = database.getDb();

        db.run('DELETE FROM testimoniale WHERE id = ?', [id], function(err) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Eroare la ștergerea testimonialului'
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Testimonialul nu a fost găsit'
                });
            }

            res.json({
                success: true,
                message: 'Testimonial șters cu succes'
            });
        });
    },

    // Obține statistici despre testimoniale (doar admin)
    getTestimonialsStats: (req, res) => {
        const db = database.getDb();

        const queries = [
            'SELECT COUNT(*) as total FROM testimoniale',
            'SELECT COUNT(*) as aprobate FROM testimoniale WHERE status = "aprobat"',
            'SELECT COUNT(*) as in_asteptare FROM testimoniale WHERE status = "in_asteptare"',
            'SELECT AVG(rating) as rating_mediu FROM testimoniale WHERE status = "aprobat"'
        ];

        Promise.all(queries.map(query => {
            return new Promise((resolve, reject) => {
                db.get(query, (err, result) => {
                    if (err) reject(err);
                    else resolve(result);
                });
            });
        })).then(results => {
            res.json({
                success: true,
                data: {
                    total: results[0].total,
                    aprobate: results[1].aprobate,
                    in_asteptare: results[2].in_asteptare,
                    rating_mediu: parseFloat(results[3].rating_mediu || 0).toFixed(1)
                }
            });
        }).catch(err => {
            res.status(500).json({
                success: false,
                message: 'Eroare la obținerea statisticilor'
            });
        });
    },

    // Obține testimonialele pentru un eveniment specific
    getEventTestimonials: (req, res) => {
        const { id_eveniment } = req.params;
        const { limit = 10 } = req.query;
        const db = database.getDb();

        db.all(`
            SELECT t.*, e.titlu as titlu_eveniment 
            FROM testimoniale t
            LEFT JOIN evenimente e ON t.id_eveniment = e.id
            WHERE t.id_eveniment = ? AND t.status = 'aprobat'
            ORDER BY t.data_creare DESC
            LIMIT ?
        `, [id_eveniment, parseInt(limit)], (err, testimonials) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Eroare la obținerea testimonialelor pentru eveniment'
                });
            }

            res.json({
                success: true,
                data: testimonials
            });
        });
    },

    // Validări pentru testimoniale
    testimonialValidation: [
        body('nume').notEmpty().withMessage('Numele este obligatoriu'),
        body('email').isEmail().withMessage('Email invalid'),
        body('mesaj').notEmpty().isLength({ min: 10 }).withMessage('Mesajul trebuie să aibă minim 10 caractere'),
        body('rating').optional().isInt({ min: 1, max: 5 }).withMessage('Rating-ul trebuie să fie între 1 și 5'),
        body('id_eveniment').optional().isInt({ min: 1 }).withMessage('ID eveniment invalid')
    ]
};

module.exports = testimonialsController;