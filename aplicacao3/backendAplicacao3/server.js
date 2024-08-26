const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const connectDB = require('./middlewares/BD');
const rotasPublicas = require('./routes/rotasPublicas');
const rotasPrivadas = require('./routes/rotasPrivadas');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware de log personalizado
app.use((req, res, next) => {
  res.on('finish', () => {
    console.log(`Request URL: ${req.originalUrl}`);
    console.log(`Response Status: ${res.statusCode}`);
    console.log(`Response Size: ${res.get('Content-Length') || 'Unknown'}`);
    console.log(`Content-Encoding: ${res.get('Content-Encoding') || 'None'}`);
  });
  next();
});

app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'public, max-age=3600'); 
  next();
});

app.get('/api/data', (req, res) => {
  res.json({ message: 'Este é um dado que pode ser armazenado em cache.' });
});

connectDB();

app.use('/api', rotasPublicas);
app.use('/logged', rotasPrivadas);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo deu errado!');
});

app.listen(PORT, () => {
  console.log(`Servidor está rodando na porta ${PORT}`);
});
