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

app.use(helmet());
app.use(compression());
app.use(express.json()); 
app.use(cors()); 

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
