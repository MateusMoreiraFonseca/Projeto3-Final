const { authenticateUser } = require('../services/authService');

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Nome de usuário e senha são obrigatórios.' });
  }

  console.log(username,password);
  try {
    const result = await authenticateUser(username, password);

    if (result.error) {
      return res.status(401).json({ error: result.error });
    }

    res.json({ token: result.token });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ error: 'Erro ao processar a solicitação.' });
  }
};

module.exports = { login };
