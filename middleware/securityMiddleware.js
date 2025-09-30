// Middleware avanzado de CORS
const corsOptions = {
  origin: function (origin, callback) {
    // Lista de dominios permitidos desde variables de entorno o defaults
    const allowedOrigins = process.env.ALLOWED_ORIGINS 
      ? process.env.ALLOWED_ORIGINS.split(',')
      : [
          'http://localhost:5173',
          'http://localhost:3000',
          'http://127.0.0.1:5173',
          'http://127.0.0.1:3000'
        ];
    
    // Permitir requests sin origin (aplicaciones móviles, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`CORS: Origin ${origin} no permitido`);
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Cookie'
  ],
  optionsSuccessStatus: 200 // Para legacy browsers
};

// Middleware de seguridad básica
const securityHeaders = (req, res, next) => {
  // Prevenir ataques XSS
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Política de contenido (básica)
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  
  next();
};

// Middleware para rate limiting básico
const rateLimitMap = new Map();

const simpleRateLimit = (windowMs = 15 * 60 * 1000, maxRequests = 100) => {
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowStart = now - windowMs;
    
    if (!rateLimitMap.has(ip)) {
      rateLimitMap.set(ip, []);
    }
    
    const requests = rateLimitMap.get(ip);
    
    // Limpiar requests antiguos
    const recentRequests = requests.filter(time => time > windowStart);
    rateLimitMap.set(ip, recentRequests);
    
    if (recentRequests.length >= maxRequests) {
      return res.status(429).json({
        error: 'Demasiadas peticiones',
        message: 'Has excedido el límite de peticiones. Intenta de nuevo más tarde.'
      });
    }
    
    recentRequests.push(now);
    rateLimitMap.set(ip, recentRequests);
    
    next();
  };
};

module.exports = {
  corsOptions,
  securityHeaders,
  simpleRateLimit
};