const FakeData = require('../models/FakeData');


const salvarDados = async (dados) => {
  try {
    const savedData = await FakeData.insertMany(dados);
    return savedData;
  } catch (error) {
    throw new Error('Erro ao salvar dados: ' + error.message);
  }
};

module.exports = {
  salvarDados,
};
