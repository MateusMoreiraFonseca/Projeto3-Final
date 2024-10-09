const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const connectDB = require('./middlewares/BD');
const rotasPublicas = require('./routes/rotasPublicas');
const rotasPrivadas = require('./routes/rotasPrivadas');
require('dotenv').config();
const { logger,logRequests, logErrors } = require('./middlewares/logger');


const app = express();
const PORT = process.env.PORT || 3002;

app.use((req, res, next) => {
  res.on('finish', () => {
    logger.info({
      message: 'Request processed',
      url: req.originalUrl,
      status: res.statusCode,
      size: res.get('Content-Length') || 'Unknown',
      encoding: res.get('Content-Encoding') || 'None'
    });
  });
  next();
});

app.use(logRequests); 
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(cors());

connectDB();

app.use('/api', rotasPublicas);
app.use('/logged', rotasPrivadas);

app.use(logErrors);


app.listen(PORT, () => {
  console.log(`Servidor está rodando na porta ${PORT}`);
});
