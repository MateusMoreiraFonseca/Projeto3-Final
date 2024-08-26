const mongoose = require('mongoose');
const User = require('../models/User'); 
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/Aplicacao3', {
    });

    console.log('Conectado ao MongoDB');    
    await verificarEAdicionarAdmin();
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB', error);
    process.exit(1);
  }
};


const verificarEAdicionarAdmin = async () => {
  try {
    const admin = await User.findOne({ username: 'admin' });

    if (!admin) {
     
      const novoAdmin = new User({
        username: 'admin',
        senha: 'admin',
        role: 'admin',
      });

      await novoAdmin.save();
      console.log('Usuário administrador criado com sucesso');
    } else {
      console.log('Usuário administrador já existe');
    }
  } catch (error) {
    console.error('Erro ao verificar ou adicionar o usuário administrador', error);
  }
};

module.exports = connectDB;
