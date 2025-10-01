const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    // Obtener token de cookies (prioridad) o headers
    let token = req.cookies.access_token;
    let tokenSource = 'cookie';
    
    // Si no hay token en cookies, buscar en headers
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
        tokenSource = 'header';
      }
    }

    console.log(`🔐 Autenticación - Source: ${tokenSource}, Token presente: ${!!token}`);
    console.log('🍪 Cookies recibidas:', Object.keys(req.cookies));
    console.log('📋 Headers authorization:', req.headers.authorization ? 'presente' : 'ausente');

    if (!token) {
      console.log('❌ No se encontró token de autenticación');
      return res.status(401).json({ 
        success: false,
        error: "Token de acceso requerido",
        message: "Debes iniciar sesión para acceder a este recurso",
        hint: "Asegúrate de incluir credentials: 'include' en tu petición" 
      });
    }

    // Verificar el token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    
    // Agregar información del usuario al request
    req.user = {
      id: decoded.id,
      usuario: decoded.usuario,
      email: decoded.email,
      isAdmin: decoded.isAdmin,
      empleado_ci: decoded.empleado_ci
    };
    
    console.log('✅ Usuario autenticado:', {
      id: req.user.id,
      usuario: req.user.usuario,
      isAdmin: req.user.isAdmin,
      tokenSource
    });
    
    next();
    
  } catch (error) {
    console.error("❌ Error en autenticación:", error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        error: "Token expirado",
        message: "Tu sesión ha expirado, por favor inicia sesión nuevamente",
        code: "TOKEN_EXPIRED"
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        error: "Token inválido",
        message: "Token de acceso inválido",
        code: "TOKEN_INVALID"
      });
    }
    
    return res.status(500).json({ 
      success: false,
      error: "Error interno del servidor",
      message: "Error al procesar la autenticación",
      code: "AUTH_ERROR"
    });
  }
};

module.exports = authMiddleware;