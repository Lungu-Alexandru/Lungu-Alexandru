const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const database = require('../config/database');

const authController = {
    // Înregistrare utilizator
    register: async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Date invalide',
                    errors: errors.array()
                });
            }

            const { nume, email, telefon, parola } = req.body;
            const db = database.getDb();

            // Verifică dacă email-ul există deja
            db.get('SELECT * FROM utilizatori WHERE email = ?', [email], async (err, row) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: 'Eroare la verificarea email-ului'
                    });
                }

                if (row) {
                    return res.status(400).json({
                        success: false,
                        message: 'Email-ul există deja'
                    });
                }

                // Criptează parola
                const parolaCriptata = await bcrypt.hash(parola, 10);

                // Inserează utilizatorul nou
                db.run(`
                    INSERT INTO utilizatori (nume, email, telefon, parola)
                    VALUES (?, ?, ?, ?)
                `, [nume, email, telefon, parolaCriptata], function(err) {
                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: 'Eroare la crearea contului'
                        });
                    }

                    // Generează token JWT
                    const token = jwt.sign(
                        { id: this.lastID, email, nume, rol: 'client' },
                        process.env.JWT_SECRET,
                        { expiresIn: '24h' }
                    );

                    res.status(201).json({
                        success: true,
                        message: 'Cont creat cu succes',
                        token,
                        user: {
                            id: this.lastID,
                            nume,
                            email,
                            rol: 'client'
                        }
                    });
                });
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Eroare internă de server'
            });
        }
    },

    // Autentificare utilizator
    login: async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Date invalide',
                    errors: errors.array()
                });
            }

            const { email, parola } = req.body;
            const db = database.getDb();

            db.get('SELECT * FROM utilizatori WHERE email = ?', [email], async (err, user) => {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: 'Eroare la autentificare'
                    });
                }

                if (!user) {
                    return res.status(401).json({
                        success: false,
                        message: 'Email sau parolă incorectă'
                    });
                }

                // Verifică parola
                const parolaValida = await bcrypt.compare(parola, user.parola);
                if (!parolaValida) {
                    return res.status(401).json({
                        success: false,
                        message: 'Email sau parolă incorectă'
                    });
                }

                // Generează token JWT
                const token = jwt.sign(
                    { 
                        id: user.id, 
                        email: user.email, 
                        nume: user.nume, 
                        rol: user.rol 
                    },
                    process.env.JWT_SECRET,
                    { expiresIn: '24h' }
                );

                res.json({
                    success: true,
                    message: 'Autentificare reușită',
                    token,
                    user: {
                        id: user.id,
                        nume: user.nume,
                        email: user.email,
                        rol: user.rol
                    }
                });
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Eroare internă de server'
            });
        }
    },

    // Validări pentru înregistrare
    registerValidation: [
        body('nume').notEmpty().withMessage('Numele este obligatoriu'),
        body('email').isEmail().withMessage('Email invalid'),
        body('parola').isLength({ min: 6 }).withMessage('Parola trebuie să aibă minim 6 caractere')
    ],

    // Validări pentru autentificare
    loginValidation: [
        body('email').isEmail().withMessage('Email invalid'),
        body('parola').notEmpty().withMessage('Parola este obligatorie')
    ]
};

module.exports = authController;