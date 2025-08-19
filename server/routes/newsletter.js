const express = require('express');
const router = express.Router();
const newsletterController = require('../controllers/newsletterController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Rute publice
router.post('/subscribe', 
    newsletterController.subscribeValidation,
    newsletterController.subscribe
);

router.post('/unsubscribe', newsletterController.unsubscribe);

// Rute protejate (doar admin)
router.get('/subscribers', 
    authenticateToken, 
    requireAdmin, 
    newsletterController.getSubscribers
);

router.post('/send', 
    authenticateToken, 
    requireAdmin, 
    newsletterController.sendNewsletter
);

module.exports = router;