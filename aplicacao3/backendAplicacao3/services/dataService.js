const FakeData = require('../models/FakeData');

// Função para buscar todos os dados
const getAllFakeData = async () => {
  try {
    return await FakeData.find();
  } catch (err) {
    throw new Error(err.message);
  }
};

const deleteDataByIds = async (ids) => {
  await FakeData.deleteMany({ _id: { $in: ids } });
};

module.exports = {
  getAllFakeData,
  deleteDataByIds,
};