const express = require('express');
const cors = require('cors');
const app = express();
const cookieParser = require("cookie-parser");
const { requestLogger, errorHandler, notFoundHandler } = require('./middleware/generalMiddleware');
const { corsOptions, securityHeaders, simpleRateLimit } = require('./middleware/securityMiddleware');
const { sanitizeInput } = require('./middleware/validationMiddleware');
require('dotenv').config();

// Middleware de logging
app.use(requestLogger);

// Middleware de seguridad
app.use(securityHeaders);

// Rate limiting (15 minutos, máximo 100 requests por IP)
app.use(simpleRateLimit(15 * 60 * 1000, 100));

// Middleware básico
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// CORS con configuración avanzada
app.use(cors(corsOptions));

app.use(cookieParser());

// Sanitización de entrada
app.use(sanitizeInput);

// Rutas de la aplicación
app.use('/empleado', require('./routes/empleadoRoute'));
app.use('/cliente', require('./routes/clienteRoute'));
app.use('/usuario', require('./routes/usuarioRoute'));
app.use('/auth', require('./routes/authRoute'));

// Middleware para rutas no encontradas (debe ir después de todas las rutas)
app.use(notFoundHandler);

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

app.listen(3000, () => 
    console.log('Server is running on port 3000'))
