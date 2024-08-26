// controllers/fakeDataController.js
const fakeDataService = require('../services/fakeDataService');

// Controlador para salvar múltiplos dados
const salvarDados = async (req, res) => {
  try {
    const dados = req.body;
    const savedData = await fakeDataService.salvarDados(dados);
    res.status(201).json({ message: 'Dados salvos com sucesso!', data: savedData });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao salvar dados.', error: error.message });
  }
};

module.exports = {
  salvarDados,
};
