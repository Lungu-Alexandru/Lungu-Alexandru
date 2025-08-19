const database = require('../config/database');
const { body, validationResult } = require('express-validator');
const fs = require('fs');
const path = require('path');

const eventsController = {
    // Obține toate evenimentele cu filtrare
    getAllEvents: (req, res) => {
        const { categorie, locatie, data_start, data_final, status = 'viitor', page = 1, limit = 10 } = req.query;
        const db = database.getDb();
        
        let query = 'SELECT * FROM evenimente WHERE 1=1';
        let params = [];

        if (status) {
            query += ' AND status = ?';
            params.push(status);
        }

        if (categorie) {
            query += ' AND categorie = ?';
            params.push(categorie);
        }

        if (locatie) {
            query += ' AND locatie LIKE ?';
            params.push(`%${locatie}%`);
        }

        if (data_start) {
            query += ' AND data_start >= ?';
            params.push(data_start);
        }

        if (data_final) {
            query += ' AND data_start <= ?';
            params.push(data_final);
        }

        query += ' ORDER BY data_start ASC';
        
        const offset = (page - 1) * limit;
        query += ` LIMIT ${limit} OFFSET ${offset}`;

        db.all(query, params, (err, events) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Eroare la obținerea evenimentelor'
                });
            }

            // Obține numărul total pentru paginare
            let countQuery = 'SELECT COUNT(*) as total FROM evenimente WHERE 1=1';
            if (status) {
                countQuery += ' AND status = ?';
            }

            db.get(countQuery, status ? [status] : [], (err, countResult) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: 'Eroare la numărarea evenimentelor'
                    });
                }

                res.json({
                    success: true,
                    data: events,
                    pagination: {
                        currentPage: parseInt(page),
                        totalPages: Math.ceil(countResult.total / limit),
                        totalEvents: countResult.total,
                        hasNext: (page * limit) < countResult.total,
                        hasPrev: page > 1
                    }
                });
            });
        });
    },

    // Obține evenimentele populare (top 3)
    getPopularEvents: (req, res) => {
        const db = database.getDb();
        
        db.all(`
            SELECT * FROM evenimente 
            WHERE status = 'viitor' 
            ORDER BY (vizualizari + click_uri) DESC 
            LIMIT 3
        `, (err, events) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Eroare la obținerea evenimentelor populare'
                });
            }

            res.json({
                success: true,
                data: events
            });
        });
    },

    // Obține un eveniment după ID
    getEventById: (req, res) => {
        const { id } = req.params;
        const db = database.getDb();

        // Incrementează numărul de vizualizări
        db.run('UPDATE evenimente SET vizualizari = vizualizari + 1 WHERE id = ?', [id]);

        db.get('SELECT * FROM evenimente WHERE id = ?', [id], (err, event) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Eroare la obținerea evenimentului'
                });
            }

            if (!event) {
                return res.status(404).json({
                    success: false,
                    message: 'Evenimentul nu a fost găsit'
                });
            }

            res.json({
                success: true,
                data: event
            });
        });
    },

    // Creează un eveniment nou (doar admin)
    createEvent: (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Date invalide',
                errors: errors.array()
            });
        }

        const {
            titlu,
            descriere,
            descriere_scurta,
            categorie,
            data_start,
            data_final,
            ora,
            locatie,
            pret,
            capacitate
        } = req.body;

        const db = database.getDb();
        
        const imagine_principala = req.file ? `/uploads/${req.file.filename}` : null;

        db.run(`
            INSERT INTO evenimente (
                titlu, descriere, descriere_scurta, categorie, data_start, 
                data_final, ora, locatie, pret, capacitate, imagine_principala
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            titlu, descriere, descriere_scurta, categorie, data_start,
            data_final, ora, locatie, pret || 0, capacitate, imagine_principala
        ], function(err) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Eroare la crearea evenimentului'
                });
            }

            res.status(201).json({
                success: true,
                message: 'Eveniment creat cu succes',
                data: {
                    id: this.lastID,
                    titlu,
                    imagine_principala
                }
            });
        });
    },

    // Actualizează un eveniment (doar admin)
    updateEvent: (req, res) => {
        const { id } = req.params;
        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Date invalide',
                errors: errors.array()
            });
        }

        const {
            titlu,
            descriere,
            descriere_scurta,
            categorie,
            data_start,
            data_final,
            ora,
            locatie,
            pret,
            capacitate,
            status
        } = req.body;

        const db = database.getDb();
        
        let updateQuery = `
            UPDATE evenimente SET 
                titlu = ?, descriere = ?, descriere_scurta = ?, categorie = ?,
                data_start = ?, data_final = ?, ora = ?, locatie = ?,
                pret = ?, capacitate = ?, status = ?, data_modificare = CURRENT_TIMESTAMP
        `;
        
        let params = [
            titlu, descriere, descriere_scurta, categorie,
            data_start, data_final, ora, locatie,
            pret || 0, capacitate, status || 'viitor'
        ];

        if (req.file) {
            updateQuery += ', imagine_principala = ?';
            params.push(`/uploads/${req.file.filename}`);
        }

        updateQuery += ' WHERE id = ?';
        params.push(id);

        db.run(updateQuery, params, function(err) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Eroare la actualizarea evenimentului'
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Evenimentul nu a fost găsit'
                });
            }

            res.json({
                success: true,
                message: 'Eveniment actualizat cu succes'
            });
        });
    },

    // Șterge un eveniment (doar admin)
    deleteEvent: (req, res) => {
        const { id } = req.params;
        const db = database.getDb();

        db.run('DELETE FROM evenimente WHERE id = ?', [id], function(err) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Eroare la ștergerea evenimentului'
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Evenimentul nu a fost găsit'
                });
            }

            res.json({
                success: true,
                message: 'Eveniment șters cu succes'
            });
        });
    },

    // Incrementează click-urile pentru un eveniment
    incrementClicks: (req, res) => {
        const { id } = req.params;
        const db = database.getDb();

        db.run('UPDATE evenimente SET click_uri = click_uri + 1 WHERE id = ?', [id], function(err) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Eroare la actualizarea click-urilor'
                });
            }

            res.json({
                success: true,
                message: 'Click înregistrat'
            });
        });
    },

    // Validări pentru evenimente
    eventValidation: [
        body('titlu').notEmpty().withMessage('Titlul este obligatoriu'),
        body('descriere').notEmpty().withMessage('Descrierea este obligatorie'),
        body('categorie').notEmpty().withMessage('Categoria este obligatorie'),
        body('data_start').isDate().withMessage('Data de start invalidă'),
        body('ora').notEmpty().withMessage('Ora este obligatorie'),
        body('locatie').notEmpty().withMessage('Locația este obligatorie'),
        body('pret').optional().isNumeric().withMessage('Prețul trebuie să fie numeric'),
        body('capacitate').optional().isInt({ min: 1 }).withMessage('Capacitatea trebuie să fie un număr întreg pozitiv')
    ]
};

module.exports = eventsController;