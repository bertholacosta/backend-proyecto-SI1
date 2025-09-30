const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const Validaciones = require("../utils/validaciones");
const jwt = require("jsonwebtoken");

// Login usuario

const login = async (req, res) => {
  const { usuario, contrasena } = req.body;

  try {
    Validaciones.usuario(usuario);
    Validaciones.contrasena(contrasena);

    const user = await prisma.usuario.findUnique({
      where: { usuario },
    });

    if (!user) {
      return res.status(401).json({ error: "Usuario no existe" });
    }

    const isValid = await bcrypt.compare(contrasena, user.contrasena);

    if (!isValid) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }
    const token = jwt.sign(
      { 
        usuario: user.usuario, 
        email: user.email,
        id: user.id 
      },
      process.env.SECRET_KEY || 'fallback-secret-key',
      { expiresIn: "24h" }
    );
    const { contrasena: _, ...userWithoutPassword } = user;

    // Configuración de cookies adaptada para desarrollo y producción
    const isProduction = process.env.NODE_ENV === 'production';
    
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: isProduction, // Solo HTTPS en producción
      sameSite: isProduction ? "Strict" : "Lax", // Más flexible en desarrollo
      maxAge: 24 * 60 * 60 * 1000, // 24 horas en milisegundos
      path: "/" // Asegurar que la cookie esté disponible en toda la app
    });
    return res
      .status(200)
      .json({
        success: true,
        message: "Login exitoso",
        user: {
          usuario: userWithoutPassword.usuario,
          email: userWithoutPassword.email,
          id: userWithoutPassword.id
        },
        token: token,
      });
  } catch (error) {
    console.error("Error al iniciar sesión", error);
    return res
      .status(400)
      .json({
        error: error.message || "Un error ocurrió mientras iniciabas sesión.",
      });
  }
};

const logout = async (req, res) => {
  try {
    const isProduction = process.env.NODE_ENV === 'production';
    
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "Strict" : "Lax",
      path: "/"
    });
    
    return res.status(200).json({ 
      success: true,
      message: "Logout exitoso" 
    });

  } catch (error) {
    console.error("Error al cerrar sesión", error);
    return res
      .status(400)
      .json({
        success: false,
        error: error.message || "Un error ocurrió mientras cerrabas sesión.",
      });
  }
};

// Verificar sesión actual
const verifySession = async (req, res) => {
  try {
    // El middleware verifyToken ya validó el token y agregó req.user
    const { usuario, email, id } = req.user;
    
    // Opcionalmente, verificar que el usuario aún existe en la base de datos
    const user = await prisma.usuario.findUnique({
      where: { usuario },
      select: {
        id: true,
        usuario: true,
        email: true,
        // Agregar otros campos que necesites, excepto contraseña
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Usuario no encontrado",
        message: "El usuario ya no existe en el sistema"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Sesión válida",
      user: {
        id: user.id,
        usuario: user.usuario,
        email: user.email
      }
    });

  } catch (error) {
    console.error("Error al verificar sesión:", error);
    return res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      message: "Error al verificar la sesión"
    });
  }
};

module.exports = { 
  login,
  logout,
  verifySession
};
