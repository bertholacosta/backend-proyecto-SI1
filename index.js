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

app.use('/auth', require('./routes/Administracion/authRoute'));

app.use('/clientes', require('./routes/Administracion/clienteRoute'));

app.use('/empleados', require('./routes/Administracion/empleadoRoute'));

app.use('/usuarios', require('./routes/Administracion/usuarioRoute'));

app.use('/motos', require('./routes/Administracion/motoRoute'));

app.use('/diagnosticos', require('./routes/Operacion/diagnosticoRoute'));

app.use('/bitacora', require('./routes/Administracion/bitacoraRoute'));

app.use('/proformas', require('./routes/Pedido/proformaRoute'));

app.use('/servicios', require('./routes/Administracion/servicioRoute'));

app.listen(3000, () => 
    console.log('Server is running on port 3000'))
