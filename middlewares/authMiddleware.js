const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // Debug logs
  console.log('🔐 [Auth Middleware] Verificando autenticación...');
  console.log('📨 Cookies recibidas:', req.cookies);
  console.log('🔑 Authorization Header:', req.headers.authorization);
  console.log('🌐 Origin:', req.headers.origin);
  
  // Intentar obtener token de cookies primero (método preferido)
  let token = req.cookies.access_token;
  let tokenSource = 'cookie';
  
  // Si no hay token en cookies, intentar obtenerlo del header Authorization
  // Esto es útil para dispositivos móviles iOS donde las cookies pueden fallar
  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7); // Remover 'Bearer ' del inicio
      tokenSource = 'header';
    }
  }
  
  if (!token) {
    console.log('❌ No se encontró token en cookies ni en header Authorization');
    return res.status(401).json({ error: "No hay token de autenticación" });
  }
  
  console.log(`✅ Token encontrado en ${tokenSource}, verificando...`);
  
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded; // Ahora req.user tiene usuario y email
    console.log('✅ Token válido para usuario:', decoded.usuario, `(desde ${tokenSource})`);
    next();
  } catch (error) {
    console.log('❌ Token inválido:', error.message);
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
};

module.exports = authMiddleware;