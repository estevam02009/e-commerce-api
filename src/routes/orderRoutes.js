const express = require('express');
const router = express.Router();

const { 
    createOrder, 
    getAllOrders, 
    getMyOrders, 
    updateOrderStatus, 
    createStripeSession 
} = require('../controllers/orderController');

const { protect } = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/adminMiddleware');


// Usuário cria pedido e vê historico
router.post('/', protect, createOrder);
router.get('/me', protect, getMyOrders);
router.post('/stripe/session', protect, createStripeSession);

// Admin vê todos os pedidos
router.get('/', protect, isAdmin, getAllOrders);

// Admin atualiza status do pedido
router.put('/:id', protect, isAdmin, updateOrderStatus);

module.exports = router;
