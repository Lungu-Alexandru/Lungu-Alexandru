const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Creează o plată nouă
router.post('/', 
    paymentController.paymentValidation,
    paymentController.createPayment
);

// Verifică statusul unei plăți
router.get('/status/:id_tranzactie', paymentController.checkPaymentStatus);

// Webhook pentru notificări de la Revolut
router.post('/webhook/revolut', paymentController.revolutWebhook);

// Rute protejate (doar admin)
router.get('/', 
    authenticateToken, 
    requireAdmin, 
    paymentController.getAllPayments
);

module.exports = router;