const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Înregistrare la eveniment
router.post('/events/:id_eveniment/register', 
    registrationController.registrationValidation,
    registrationController.registerForEvent
);

// Rute protejate (doar admin)
router.get('/', 
    authenticateToken, 
    requireAdmin, 
    registrationController.getAllRegistrations
);

router.get('/events/:id_eveniment', 
    authenticateToken, 
    requireAdmin, 
    registrationController.getEventRegistrations
);

router.put('/:id/status', 
    authenticateToken, 
    requireAdmin, 
    registrationController.updateRegistrationStatus
);

module.exports = router;