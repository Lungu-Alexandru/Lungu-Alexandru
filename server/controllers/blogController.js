const database = require('../config/database');
const { body, validationResult } = require('express-validator');

const blogController = {
    // Obține toate articolele
    getAllArticles: (req, res) => {
        const { page = 1, limit = 10, status = 'publicat' } = req.query;
        const db = database.getDb();
        const offset = (page - 1) * limit;

        let query = 'SELECT * FROM articole WHERE status = ? ORDER BY data_publicare DESC';
        let params = [status];

        // Pentru admin, poate vedea toate articolele
        if (req.user && req.user.rol === 'admin' && req.query.all === 'true') {
            query = 'SELECT * FROM articole ORDER BY data_publicare DESC';
            params = [];
        }

        query += ` LIMIT ${limit} OFFSET ${offset}`;

        db.all(query, params, (err, articles) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Eroare la obținerea articolelor'
                });
            }

            // Obține numărul total pentru paginare
            let countQuery = 'SELECT COUNT(*) as total FROM articole WHERE status = ?';
            let countParams = [status];

            if (req.user && req.user.rol === 'admin' && req.query.all === 'true') {
                countQuery = 'SELECT COUNT(*) as total FROM articole';
                countParams = [];
            }

            db.get(countQuery, countParams, (err, countResult) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: 'Eroare la numărarea articolelor'
                    });
                }

                res.json({
                    success: true,
                    data: articles,
                    pagination: {
                        currentPage: parseInt(page),
                        totalPages: Math.ceil(countResult.total / limit),
                        totalArticles: countResult.total
                    }
                });
            });
        });
    },

    // Obține un articol după ID
    getArticleById: (req, res) => {
        const { id } = req.params;
        const db = database.getDb();

        let query = 'SELECT * FROM articole WHERE id = ?';
        let params = [id];

        // Pentru utilizatori normali, doar articole publicate
        if (!req.user || req.user.rol !== 'admin') {
            query = 'SELECT * FROM articole WHERE id = ? AND status = "publicat"';
        }

        db.get(query, params, (err, article) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Eroare la obținerea articolului'
                });
            }

            if (!article) {
                return res.status(404).json({
                    success: false,
                    message: 'Articolul nu a fost găsit'
                });
            }

            res.json({
                success: true,
                data: article
            });
        });
    },

    // Creează un articol nou (doar admin)
    createArticle: (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Date invalide',
                errors: errors.array()
            });
        }

        const { titlu, continut, rezumat, status = 'publicat' } = req.body;
        const db = database.getDb();
        
        const imagine_principala = req.file ? `/uploads/${req.file.filename}` : null;

        db.run(`
            INSERT INTO articole (titlu, continut, rezumat, imagine_principala, status)
            VALUES (?, ?, ?, ?, ?)
        `, [titlu, continut, rezumat, imagine_principala, status], function(err) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Eroare la crearea articolului'
                });
            }

            res.status(201).json({
                success: true,
                message: 'Articol creat cu succes',
                data: {
                    id: this.lastID,
                    titlu,
                    imagine_principala
                }
            });
        });
    },

    // Actualizează un articol (doar admin)
    updateArticle: (req, res) => {
        const { id } = req.params;
        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Date invalide',
                errors: errors.array()
            });
        }

        const { titlu, continut, rezumat, status } = req.body;
        const db = database.getDb();
        
        let updateQuery = `
            UPDATE articole SET 
                titlu = ?, continut = ?, rezumat = ?, status = ?,
                data_modificare = CURRENT_TIMESTAMP
        `;
        
        let params = [titlu, continut, rezumat, status || 'publicat'];

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
                    message: 'Eroare la actualizarea articolului'
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Articolul nu a fost găsit'
                });
            }

            res.json({
                success: true,
                message: 'Articol actualizat cu succes'
            });
        });
    },

    // Șterge un articol (doar admin)
    deleteArticle: (req, res) => {
        const { id } = req.params;
        const db = database.getDb();

        db.run('DELETE FROM articole WHERE id = ?', [id], function(err) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Eroare la ștergerea articolului'
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Articolul nu a fost găsit'
                });
            }

            res.json({
                success: true,
                message: 'Articol șters cu succes'
            });
        });
    },

    // Obține ultimele articole pentru pagina principală
    getLatestArticles: (req, res) => {
        const { limit = 3 } = req.query;
        const db = database.getDb();

        db.all(`
            SELECT id, titlu, rezumat, imagine_principala, data_publicare
            FROM articole 
            WHERE status = 'publicat' 
            ORDER BY data_publicare DESC 
            LIMIT ?
        `, [parseInt(limit)], (err, articles) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Eroare la obținerea ultimelor articole'
                });
            }

            res.json({
                success: true,
                data: articles
            });
        });
    },

    // Validări pentru articole
    articleValidation: [
        body('titlu').notEmpty().withMessage('Titlul este obligatoriu'),
        body('continut').notEmpty().withMessage('Conținutul este obligatoriu'),
        body('status').optional().isIn(['publicat', 'draft', 'arhivat']).withMessage('Status invalid')
    ]
};

module.exports = blogController;