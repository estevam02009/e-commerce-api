const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✔ MOngoDB Conectado.');
    } catch (error) {
        console.error('❌ Erro ao conectar MongoDB', error);
        process.exit(1);
    }
};

module.exports = connectDB;  //exportando a função para ser usada em outros arquivos.