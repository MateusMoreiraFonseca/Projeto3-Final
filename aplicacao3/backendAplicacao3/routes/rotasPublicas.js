const express = require('express');
const router = express.Router();
const { login } = require('../controllers/loginController'); 

router.post('/login', login);
router.get('/home', (req, res) => {
  res.json({ message: 'Bem-vindo à API!' });
});

module.exports = router;
