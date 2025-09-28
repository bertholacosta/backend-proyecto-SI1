require("dotenv").config();
const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const Validaciones = require("../utils/validaciones");

// Crear Nuevo Usuario

const createUsuario = async (req, res) => {
  const { empleado_cif, usuario, contrasena, email } = req.body;
  try {
    const empleado_ci = parseInt(empleado_cif,10);
    Validaciones.empleado_ci(empleado_ci);
    Validaciones.usuario(usuario);
    Validaciones.contrasena(contrasena);
    Validaciones.email(email);

    const user = await prisma.usuario.findUnique({
      where: {
        usuario: usuario,
      },
    });
    if (user) {
      return res.status(409).json({ error: "Usuario ya existe" });
    }
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    const newUsuario = await prisma.usuario.create({
      data: {
        empleado_ci,
        usuario,
        contrasena: hashedPassword,
        email,
      },
    });

    // Omitir la contraseña en la respuesta
    const { contrasena: _, ...usuarioSinContrasena } = newUsuario;
    res.status(201).json(usuarioSinContrasena);
  } catch (error) {
    console.error("Error al crear usuario", error);
    res
      .status(400)
      .json({
        error: error.message || "Un error ocurrió mientras creabas el usuario.",
      });
  }
};

// Mostrar Usuarios

const mostrarUsuarios = async (req, res) => {
    try {
      const usuarios = await prisma.usuario.findMany();
      res.status(200).json(usuarios);
    } catch (error) {
      console.error("Error al obtener usuarios", error);
      res
        .status(400)
        .json({
          error:
            error.message || "Un error ocurrió mientras obtenías los usuarios.",
        });
    }
};

// Convertir usuario en administrador
const createAdmin = async (req, res) => {
  const { usuario_id } = req.body;
  try {
    // Verifica que el usuario exista
    const usuario = await prisma.usuario.findUnique({
      where: { id: usuario_id }
    });
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Verifica si ya es administrador
    const adminExistente = await prisma.administrador.findUnique({
      where: { usuario_id }
    });
    if (adminExistente) {
      return res.status(409).json({ error: "Ya es administrador" });
    }

    // Crea el registro de administrador
    const nuevoAdmin = await prisma.administrador.create({
      data: { usuario_id }
    });

    res.status(201).json({ message: "Usuario convertido en administrador", administrador: nuevoAdmin });
  } catch (error) {
    console.error("Error al convertir en administrador", error);
    res.status(400).json({ error: error.message || "Error al convertir en administrador" });
  }
};

// Quitar rol de administrador
const removeAdmin = async (req, res) => {
  const { usuario_id } = req.body;
  try {
    // Verifica que el usuario exista
    const usuario = await prisma.usuario.findUnique({
      where: { id: usuario_id }
    });
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Verifica si es administrador
    const adminExistente = await prisma.administrador.findUnique({
      where: { usuario_id }
    });
    if (!adminExistente) {
      return res.status(409).json({ error: "El usuario no es administrador" });
    }

    // Elimina el registro de administrador
    await prisma.administrador.delete({
      where: { usuario_id }
    });

    res.status(200).json({ message: "Rol de administrador removido" });
  } catch (error) {
    console.error("Error al remover rol de administrador", error);
    res.status(400).json({ error: error.message || "Error al remover rol de administrador" });
  }
};

module.exports = {
  createUsuario,
  mostrarUsuarios,
  createAdmin,
  removeAdmin
};
