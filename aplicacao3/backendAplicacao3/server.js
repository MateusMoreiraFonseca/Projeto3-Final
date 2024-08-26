const express = require('express');
const cors = require('cors');
const connectDB = require('./middlewares/BD');
const rotasPublicas = require('./routes/rotasPublicas');
const rotasPrivadas = require('./routes/rotasPrivadas');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT; 

app.use(express.json()); 
app.use(cors()); 

connectDB();

app.use('/api', rotasPublicas); 
app.use('/logged', rotasPrivadas); 

app.listen(PORT, () => {
  console.log(`Servidor está rodando na porta ${PORT}`);
});
