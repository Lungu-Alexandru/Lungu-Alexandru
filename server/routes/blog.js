const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const blogController = require('../controllers/blogController');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Configurare multer pentru încărcarea imaginilor
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'server/uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'article-' + uniqueSuffix + path.extname(file.originalname));
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
router.get('/', blogController.getAllArticles);
router.get('/latest', blogController.getLatestArticles);
router.get('/:id', blogController.getArticleById);

// Rute protejate (doar admin)
router.post('/', 
    authenticateToken, 
    requireAdmin, 
    upload.single('imagine'),
    blogController.articleValidation,
    blogController.createArticle
);

router.put('/:id', 
    authenticateToken, 
    requireAdmin, 
    upload.single('imagine'),
    blogController.articleValidation,
    blogController.updateArticle
);

router.delete('/:id', 
    authenticateToken, 
    requireAdmin, 
    blogController.deleteArticle
);

module.exports = router;