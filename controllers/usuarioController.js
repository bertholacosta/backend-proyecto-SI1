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

module.exports = {
  createUsuario,
  mostrarUsuarios
};
