const express = require('express');
const router = express.Router();

// Home page
router.get('/', (req, res) => {
    res.render('home', { title: 'Acasă' });
});

// Wine page
router.get('/vin', (req, res) => {
    res.render('wine', { title: 'Vin' });
});

// Food page
router.get('/mancare', (req, res) => {
    res.render('food', { title: 'Mâncare' });
});

// Travel page
router.get('/calatorii', (req, res) => {
    res.render('travel', { title: 'Călătorii' });
});

// Explore More page
router.get('/explore-more', (req, res) => {
    res.render('explore-more', { title: 'Explore More' });
});

// Private Club page
router.get('/club-privat', (req, res) => {
    res.render('private-club', { title: 'Club Privat' });
});

module.exports = router;
