const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Onome é obrigatório.'],
    },
    email: {
        type: String,
        required: [true, 'E-mail é obrigatório.'],
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, 'Senha é obrigatório.'],
        minlength: [6, 'A senha deve ter no mínimo 6 caracteres.'],
    },
    role: {
        type: String,
        enum: ['admin', 'customer'],
        default: 'customer',
    },
}, { timestamps: true });

// Criptografar senha antes de salvar
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Metodo para comparar senhas
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);  // Exporta o modelo de usuário