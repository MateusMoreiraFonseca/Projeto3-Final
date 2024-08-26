const { body, validationResult } = require('express-validator');

const validateLogin = [
  body('username')
    .isString()
    .notEmpty()
    .withMessage('Nome de usuário é obrigatório.'),
  body('password')
    .isString()
    .notEmpty()
    .withMessage('Senha é obrigatória.'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = { validateLogin };
