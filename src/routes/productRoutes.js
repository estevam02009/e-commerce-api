const express = require('express');
const router = express.Router();
const { createProduct, getProducts, getProductById, updateProduct, deleteProduct } = require('../controllers/productController');

const { protect } = require('../middlewares/authMiddleware');
const { isAdmin }  = require('../middlewares/adminMiddleware');

// Rotas publicas
router.get('/', getProducts);
router.get('/:id', getProductById);

// Protegida e restrita a admins
router.post('/', protect, isAdmin, createProduct);
router.put('/:id', protect, isAdmin, updateProduct);
router.delete('/:id', protect, isAdmin, deleteProduct);

module.exports = router;