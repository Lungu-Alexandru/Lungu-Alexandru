const express = require('express');
const router = express.Router();
const testimonialsController = require('../controllers/testimonialsController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Rute publice
router.get('/', testimonialsController.getApprovedTestimonials);
router.get('/events/:id_eveniment', testimonialsController.getEventTestimonials);
router.post('/', 
    testimonialsController.testimonialValidation,
    testimonialsController.createTestimonial
);

// Rute protejate (doar admin)
router.get('/all', 
    authenticateToken, 
    requireAdmin, 
    testimonialsController.getAllTestimonials
);

router.get('/stats', 
    authenticateToken, 
    requireAdmin, 
    testimonialsController.getTestimonialsStats
);

router.put('/:id/status', 
    authenticateToken, 
    requireAdmin, 
    testimonialsController.updateTestimonialStatus
);

router.delete('/:id', 
    authenticateToken, 
    requireAdmin, 
    testimonialsController.deleteTestimonial
);

module.exports = router;