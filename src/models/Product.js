const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'O nome do produto é obrigatório.'],
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: [true, 'O preço é obrigatório'],
    },
    stock: {
        type: Number,
        required: [true, 'A quantidade em estoque é obrigatória'],
        default: 0,
    },
    category: {
        type: String,
        required: true,
    },
    images: [
        {
            url: String,
        },
    ],
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);