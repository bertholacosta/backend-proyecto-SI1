const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const Validaciones = require("../utils/validaciones");
const jwt = require("jsonwebtoken");
const bitacora = require("../utils/bitacora").bitacora;

// Login usuario

const login = async (req, res) => {
  const { usuario, contrasena } = req.body;

  try {
    Validaciones.usuario(usuario);
    Validaciones.contrasena(contrasena);

    const user = await prisma.usuario.findUnique({
      where: { usuario },
      include: {
        administrador: true,
        empleado: true
      }
    });

    if (!user) {
      // Para usuario inexistente, registrar sin usuario_id (solo si fuera posible)
      // Por ahora no registramos estos eventos hasta que se permita usuario_id NULL
      console.log(`Intento fallido de inicio de sesión para usuario inexistente: ${usuario}`);
      return res.status(401).json({ error: "Usuario no existe" });
    }

    const isValid = await bcrypt.compare(contrasena, user.contrasena);

    if (!isValid) {
      await bitacora({
        req,
        res,
        descripcion: `Intento fallido de inicio de sesión para usuario ${usuario} - contraseña incorrecta`,
        usuario_id: user.id,
      });
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }
    const isAdmin = !!user.administrador;
    
    const token = jwt.sign(
      { 
        id: user.id,
        usuario: user.usuario, 
        email: user.email,
        isAdmin: isAdmin,
        empleado_ci: user.empleado_ci
      },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );
    const { contrasena: _, ...userWithoutPassword } = user;

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Solo usar secure en producción
      sameSite: "Strict",
      maxAge: 3600000,
    });
    await bitacora({
      req,
      res,
      descripcion: `Inicio de sesión exitoso para usuario ${usuario}`,
      usuario_id: user.id,
    });
    return res
      .status(200)
      .json({
        usuario: userWithoutPassword.usuario,
        email: userWithoutPassword.email,
        isAdmin: isAdmin,
        empleado: userWithoutPassword.empleado,
        token: token,
      });
  } catch (error) {
    console.error("Error al iniciar sesión", error);
    return res.status(400).json({
      error: error.message || "Un error ocurrió mientras iniciabas sesión.",
    });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Solo usar secure en producción
      sameSite: "Strict",
    });
    await bitacora({
      req,
      res,
      descripcion: `Cierre de sesión exitoso para el usuario ${req.user.usuario}`,
    });
    return res.status(200).json({ message: "Logout exitoso" });
  } catch (error) {
    console.error("Error al cerrar sesión", error);
    return res.status(400).json({
      error: error.message || "Un error ocurrió mientras cerrabas sesión.",
    });
  }
};

// Verificar sesión activa
const verificarSesion = async (req, res) => {
  try {
    // Si llegamos aquí, el middleware de autenticación ya validó el token
    // Los datos ya están en req.user del JWT
    return res.status(200).json({
      usuario: req.user.usuario,
      email: req.user.email,
      isAdmin: req.user.isAdmin,
      empleado_ci: req.user.empleado_ci,
      isAuthenticated: true
    });
  } catch (error) {
    console.error("Error al verificar sesión", error);
    return res.status(401).json({ error: "Sesión inválida" });
  }
};

module.exports = { login, logout, verificarSesion };
