const express = require('express');
const router = express.Router();
const autenticacao = require('../middlewares/autenticacao');
const { salvarDados } = require('../controllers/fakeDataController');
const { buscarDados, apagarDados} = require('../controllers/dataController');
// Rota para salvar dados (protegido por autenticação)
router.post('/salvarDados', autenticacao, salvarDados);

// Rota para buscar dados salvos (protegido por autenticação)
router.get('/buscarDadosSalvos', autenticacao, buscarDados);
router.delete('/excluirDadosSalvos', autenticacao, apagarDados);


// Outras rotas comentadas, se necessário
// router.post('/persons', createPersonController);
// router.get('/buscarPersons', autenticacao, buscarPersons);
// router.get('/persons/:id', getPersonByIdController);
// router.post('/inserir', autenticacao, inserirDados);

module.exports = router;
