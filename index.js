const express = require('express');
const cors = require('cors');
const app = express();
const cookieParser = require("cookie-parser");
require('dotenv').config();

app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173", // tu React
  credentials: true // permite cookies cross-origin
}));

app.use(cookieParser());

app.use('/empleado', require('./routes/empleadoRoute'));

app.use('/cliente', require('./routes/clienteRoute'));

app.use('/usuario', require('./routes/usuarioRoute'));

app.use('/auth',require('./routes/authRoute'));

app.listen(3000, () => 
    console.log('Server is running on port 3000'))
