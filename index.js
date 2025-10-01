const express = require('express');
const cors = require('cors');
const cookieParser = require("cookie-parser");
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cookieParser());

// Configuración de CORS para cross-origin entre Vercel y Render
const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = [
            'https://frontend-proyecto-si-1.vercel.app',
            'http://localhost:5173',
            'http://localhost:3000',
            'http://localhost:3001',
            'http://127.0.0.1:5173',
            'http://127.0.0.1:3000'
        ];
        
        // Permitir requests sin origin (aplicaciones móviles, Postman, etc.)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.warn(`CORS: Origin ${origin} no permitido`);
            // En producción, ser más estricto pero permitir para debugging
            callback(null, process.env.NODE_ENV !== 'production' || origin?.includes('vercel.app'));
        }
    },
    credentials: true, // MUY IMPORTANTE: permite cookies cross-origin
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
        'Content-Type', 
        'Authorization', 
        'Cookie', 
        'X-Requested-With',
        'Access-Control-Allow-Credentials'
    ],
    exposedHeaders: ['Set-Cookie'],
    optionsSuccessStatus: 200,
    preflightContinue: false
};

app.use(cors(corsOptions));

// Middleware para manejar preflight requests manualmente
app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie, X-Requested-With');
        res.header('Access-Control-Allow-Credentials', 'true');
        return res.status(200).end();
    }
    next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware de logging para debugging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    console.log('Headers:', req.headers);
    console.log('Cookies:', req.cookies);
    next();
});

// Ruta de health check
app.get('/', (req, res) => {
    res.json({ 
        message: 'Backend API funcionando correctamente',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Rutas de la aplicación
app.use('/marcamoto', require('./routes/marcamotoRoute'));

app.use('/usuario', require('./routes/registroRoute'));

app.use('/auth', require('./routes/authRoute'));

app.use('/clientes', require('./routes/clienteRoute'));

app.use('/empleados', require('./routes/empleadoRoute'));

app.use('/usuarios', require('./routes/usuarioRoute'));

// Middleware de manejo de errores global
app.use((err, req, res, next) => {
    console.error('Error global capturado:', err);
    
    // Error de CORS
    if (err.message === 'No permitido por CORS') {
        return res.status(403).json({
            success: false,
            error: 'CORS Error',
            message: 'Origen no permitido'
        });
    }
    
    // Error de Prisma
    if (err.code?.startsWith('P')) {
        console.error('Error de Prisma:', err.code, err.message);
        return res.status(400).json({
            success: false,
            error: 'Error de base de datos',
            message: 'Error al procesar la solicitud'
        });
    }
    
    return res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: process.env.NODE_ENV === 'production' 
            ? 'Ha ocurrido un error inesperado' 
            : err.message
    });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Ruta no encontrada',
        message: `La ruta ${req.method} ${req.originalUrl} no existe`
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`Database URL configured: ${process.env.DATABASE_URL ? 'Yes' : 'No'}`);
});
