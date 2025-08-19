const jwt = require('jsonwebtoken');
const database = require('../config/database');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: 'Token de acces lipsă' 
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ 
                success: false, 
                message: 'Token invalid' 
            });
        }
        req.user = user;
        next();
    });
};

const requireAdmin = (req, res, next) => {
    if (!req.user || req.user.rol !== 'admin') {
        return res.status(403).json({ 
            success: false, 
            message: 'Acces interzis - necesită drepturi de administrator' 
        });
    }
    next();
};

module.exports = { authenticateToken, requireAdmin };