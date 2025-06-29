const Order = require('../models/Order');
const Product = require('../models/Product');

// Criar pedido
exports.createOrder = async (req, res) => {
    const { orderItems } = req.body;

    if (!orderItems || orderItems.length === 0) {
        return res.status(400).json({ message: 'Nenhum item no pedido' });
    }

    try {
        // Verificar estoque e calcular total
        let totalPrice = 0;

        for (const item of orderItems) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({ message: `Produto não encontrado: ${item.product}` });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `Estoque insuficiente para ${product.name}` });
            }
            totalPrice += product.price * item.quantity;
        }

        // Criar pedido
        const order = await Order.create({
            user: req.user._id,
            orderItems,
            totalPrice,
        });

        // Atualizar estoque
        for (const item of orderItems) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: -item.quantity },
            });
        }

        res.status(201).json(order);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao criar pedido', error: err.message });
    }
};

// Listar pedidos do usuário
exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).populate('orderItems.product');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao listar pedidos', error: err.message });
    }
};

// Listar todos os pedidos (admin)
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'name email').populate({
            path: 'orderItems.product',
            populate: {
                path: 'category',
                model: 'Category',
            }
        });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao listar pedidos', error: err.message });
    }
};

//Atualizar status do pedido (admin)
exports.updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Pedido não encontrado' });
        }

        order.status = status;
        await order.save();

        res.json(order);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao atualizar status do pedido', error: err.message });
    }
};