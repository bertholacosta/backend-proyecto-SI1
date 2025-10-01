const express = require('express');
const cors = require('cors');

const app = express();
const cookieParser = require("cookie-parser");
require('dotenv').config();

app.use(cookieParser());

app.use(cors({
    origin: ['https://frontend-proyecto-si-1.vercel.app'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

app.use(express.json());

app.use('/marcamoto', require('./routes/marcamotoRoute'));

app.use('/usuario', require('./routes/registroRoute'));

app.use('/auth', require('./routes/authRoute'));

app.use('/clientes', require('./routes/clienteRoute'));

app.use('/empleados', require('./routes/empleadoRoute'));

app.use('/usuarios', require('./routes/usuarioRoute'));

app.listen(3000, () => 
    console.log('Server is running on port 3000'))
