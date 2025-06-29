const express = require('express');
const router = express.Router();

const { createOrder, getAllOrders, getMyOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/adminMiddleware');


// Usuário cria pedido e vê historico
router.post('/', protect, createOrder);
router.get('/me', protect, getMyOrders);

// Admin vê todos os pedidos
router.get('/', protect, isAdmin, getAllOrders);

// Admin atualiza status do pedido
router.put('/:id', protect, isAdmin, updateOrderStatus);

module.exports = router;
