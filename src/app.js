const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./config/db');
const redis = require('./config/redis');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');

connectDB();

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

app.use('/', (req, res) => {
    res.send('API rodando!');
});

module.exports = app;  // Exporta a aplicação para ser utilizada em outros arquivos