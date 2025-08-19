const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const eventsController = require('../controllers/eventsController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Configurare multer pentru încărcarea imaginilor
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'server/uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'event-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Doar imagini sunt permise (jpeg, jpg, png, gif, webp)'));
        }
    }
});

// Rute publice
router.get('/', eventsController.getAllEvents);
router.get('/popular', eventsController.getPopularEvents);
router.get('/:id', eventsController.getEventById);
router.post('/:id/click', eventsController.incrementClicks);

// Rute protejate (doar admin)
router.post('/', 
    authenticateToken, 
    requireAdmin, 
    upload.single('imagine'),
    eventsController.eventValidation,
    eventsController.createEvent
);

router.put('/:id', 
    authenticateToken, 
    requireAdmin, 
    upload.single('imagine'),
    eventsController.eventValidation,
    eventsController.updateEvent
);

router.delete('/:id', 
    authenticateToken, 
    requireAdmin, 
    eventsController.deleteEvent
);

module.exports = router;