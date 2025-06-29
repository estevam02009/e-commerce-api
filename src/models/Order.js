const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    name: String,
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
});

const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    orderItems: [orderItemSchema],  // changed from orderItem to orderItems and embedded schema
    totalPrice: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['processando', 'pago', 'enviado', 'entregue'],
        default: 'processando',
    },
}, { timestamps: true });  // fixed option from timeseries to timestamps

module.exports = mongoose.model('Order', OrderSchema);