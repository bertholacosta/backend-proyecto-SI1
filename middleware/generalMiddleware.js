// Middleware para logging de requests
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const ip = req.ip || req.connection.remoteAddress;
  
  console.log(`[${timestamp}] ${method} ${url} - IP: ${ip}`);
  
  next();
};

// Middleware para manejo de errores
const errorHandler = (err, req, res, next) => {
  console.error('Error capturado por middleware:', err);
  
  // Error de validación de Prisma
  if (err.code === 'P2002') {
    return res.status(400).json({
      error: 'Violación de restricción única',
      message: 'El registro ya existe en la base de datos'
    });
  }
  
  // Error de registro no encontrado en Prisma
  if (err.code === 'P2025') {
    return res.status(404).json({
      error: 'Registro no encontrado',
      message: 'El registro solicitado no existe'
    });
  }
  
  // Error de JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Token inválido',
      message: 'Token de acceso inválido'
    });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token expirado',
      message: 'Tu sesión ha expirado'
    });
  }
  
  // Error de validación
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Error de validación',
      message: err.message
    });
  }
  
  // Error genérico del servidor
  return res.status(500).json({
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'production' 
      ? 'Ha ocurrido un error inesperado' 
      : err.message
  });
};

// Middleware para rutas no encontradas
const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    message: `La ruta ${req.method} ${req.url} no existe`
  });
};

module.exports = {
  requestLogger,
  errorHandler,
  notFoundHandler
};