const express = require('express');
const router = express.Router();
const { login } = require('../controllers/loginController'); 
const { validateLogin } = require('../middlewares/validateLogin');


router.post('/login', validateLogin, login);
router.get('/home', (req, res) => {
  res.json({ message: 'Bem-vindo à API!' });
});

module.exports = router;
