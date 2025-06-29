const Order = require('../models/Order');
const Product = require('../models/Product');
const stripe = require('../config/stripe');

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

// Criar sessão sepagamento Stripe
exports.createStripeSession = async (req, res) => {
    const { orderId } = req.body;

    try {
        const order = await Order.findById(orderId).populate('orderItems.product');
        if (!order) {
            return res.status(404).json({ message: 'Pedido não encontrado' });
        }

        // Mapear produtos
        const line_items = order.orderItems.map(item => ({
            price_data: {
                currency: 'brl',
                productData: {
                    name: item.name,
                },
                unit_amount: Math.round(item.price * 100), // Stripe usa centavos
            },
            quantity: item.quantity,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_ur: `${process.env.CLIENT_URL}/success?order=${order._id}`,
            cancel_url: `${process.env.CLIENT_URL}/cancel`,
            metadata: {
                orderId: order._id.toString(),
            },
        });

        res.json({ url: session.url });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao criar sessão se pagamento.', error: err.message });
    }
};

// Webhook do Stripe
exports.stripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.rawBody,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error('Webhook error:', err.message);
        return res.status(400).send(`Webhook error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const orderId = session.metadata.orderId;

        try {
            await Order.findByIdAndUpdate(orderId, { status: 'pago' });
            console.log(`✔ Pedido ${orderId} marcado como pago.`);
        } catch (err) {
            console.error(`Erro ao atualizar pedido:`, err.message);
        }
    }

    res.json({ received: true });
}