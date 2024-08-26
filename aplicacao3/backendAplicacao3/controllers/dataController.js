const DataService = require('../services/DataService');

// Função para buscar todos os dados
const buscarDados = async (req, res) => {
  try {
    const data = await DataService.getAllFakeData();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const apagarDados = async (req, res) => {

  console.log('IDs recebidos:', req.body.ids);
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'IDs inválidos fornecidos.' });
    }

    await DataService.deleteDataByIds(ids);

    res.status(200).json({ message: 'Dados excluídos com sucesso!' });
  } catch (err) {
    console.error('Erro ao excluir dados:', err);
    res.status(500).json({ message: err.message });
  }
};


module.exports = {
  buscarDados,
  apagarDados,
};
