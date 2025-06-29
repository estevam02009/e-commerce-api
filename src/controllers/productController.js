const Product = require('../models/Product');

// Criar produto
exports.createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (err) {
        res.status(400).json({ message: 'Erro ao criar produto', error: err.message });
    }
};

// Listar produtos com busca e paginação
exports.getProducts = async (req, res) => {
    const { page = 1, limit = 10, search = '' } = req.query;

    try {
        const query = {
            name: { $regex: search, $options: 'i' },
        };
        const products = await Product.find(query)
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const total = await Product.countDocuments(query);

        res.status(200).json({
            total,
            page: Number(page),
            pages: Math.ceil(total / limit),
            products,
        });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao buscar produtos', error: err.message });
    }
};

// Buscar produto por Id
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao buscar produto', error: err.message });
    }
};

// Atualizar produto
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: 'Erro ao atualizar produto', error: err.message });
    }
};

// Deletar produto
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Produto não encontrado' });
        }
        res.json({ message: 'Produto deletado com sucesso' });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao deletar produto', error: err.message });
    }
};
