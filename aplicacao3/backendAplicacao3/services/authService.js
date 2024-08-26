const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); 

const JWT_SECRET = process.env.JWT_SECRET;

const logger = require('winston');

const authenticateUser = async (username, password) => {
  try {
    const user = await User.findOne({ username });

    if (!user) {
      return { error: 'Nome de usuário ou senha inválidos.' };
    }

    const isMatch = await bcrypt.compare(password, user.senha);

    if (!isMatch) {
      return { error: 'Nome de usuário ou senha inválidos.' };
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

    return { token };
  } catch (error) {
    logger.error('Erro ao autenticar usuário:', error);
    return { error: 'Erro ao processar a solicitação.' };
  }
};


module.exports = { authenticateUser };
