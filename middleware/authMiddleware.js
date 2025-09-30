const jwt = require("jsonwebtoken");

// Middleware de autenticación
const verifyToken = (req, res, next) => {
  try {
    // Obtener token de cookies o headers (prioridad a cookies)
    let token = req.cookies.access_token;
    
    // Si no hay token en cookies, buscar en headers
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
    }

    if (!token) {
      return res.status(401).json({ 
        success: false,
        error: "Token de acceso requerido",
        message: "Debes iniciar sesión para acceder a este recurso" 
      });
    }

    // Verificar el token
    const decoded = jwt.verify(token, process.env.SECRET_KEY || 'fallback-secret-key');
    
    // Agregar información del usuario al request
    req.user = {
      usuario: decoded.usuario,
      email: decoded.email,
      id: decoded.id
    };
    
    next();
  } catch (error) {
    console.error("Error en autenticación:", error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        error: "Token expirado",
        message: "Tu sesión ha expirado, por favor inicia sesión nuevamente" 
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        error: "Token inválido",
        message: "Token de acceso inválido" 
      });
    }
    
    return res.status(500).json({ 
      success: false,
      error: "Error interno del servidor",
      message: "Error al procesar la autenticación" 
    });
  }
};

// Middleware opcional - no requiere autenticación pero agrega info del usuario si está autenticado
const optionalAuth = (req, res, next) => {
  try {
    const token = req.cookies.access_token || req.headers.authorization?.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      req.user = {
        usuario: decoded.usuario,
        email: decoded.email
      };
    }
    
    next();
  } catch (error) {
    // Si hay error, continúa sin usuario autenticado
    next();
  }
};

module.exports = { 
  verifyToken, 
  optionalAuth 
};