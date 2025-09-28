require("dotenv").config();
const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const Validaciones = require("../utils/validaciones");
// Create a new usuario

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

//crear cliente

const createCliente = async (req, res) => {
  const { ci, nombre, telefono, direccion } = req.body;
  try {

    ci1 = Number(ci);

    console.log(typeof ci1, ci1);
    Validaciones.ci(ci1);
    Validaciones.nombre(nombre);

    Validaciones.telefono(telefono);
    Validaciones.direccion(direccion);
    const cliente = await prisma.cliente.findUnique({
      where: {
        ci: ci1,
      },
    });
    if (cliente) {
      return res.status(409).json({ error: "Cliente ya existe" });
    }
    const newCliente = await prisma.cliente.create({
      data: {
        ci: ci1,
        nombre,
        telefono,
        direccion,
      },
    });
    res.status(201).json(newCliente);
  } catch (error) {
    console.error("Error al crear cliente", error);
    res
      .status(400)
      .json({
        error: error.message || "Un error ocurrió mientras creabas el cliente.",
      });
  }
};
// mostrar clientes

const mostrarClientes = async (req, res) => {
  try {
    const clientes = await prisma.cliente.findMany();
    res.status(200).json(clientes);
  } catch (error) {
    console.error("Error al obtener clientes", error);
    res
      .status(400)
      .json({
        error:
          error.message || "Un error ocurrió mientras obtenías los clientes.",
      });
  }
};

const createEmpleado = async (req, res) => {
  const { ci, nombre, Fechanac, direccion, telefono } = req.body;
  try {

    Validaciones.ci(ci);
    Validaciones.nombre(nombre);
    Validaciones.Fechanac(Fechanac);
    Validaciones.direccion(direccion);
    Validaciones.telefono(telefono);
    const empleado = await prisma.empleado.findUnique({
      where: {
        ci: ci,
      },
    });
    if (empleado) {
      return res.status(409).json({ error: "Empleado ya existe" });
    }
    const newEmpleado = await prisma.empleado.create({
      data: {
        ci,
        nombre,
        Fechanac,
        direccion,
        telefono,
      },
    });
    res.status(201).json(newEmpleado);
  } catch (error) {
    console.error("Error al crear empleado", error);
    res
      .status(400)
      .json({
        error:
          error.message || "Un error ocurrió mientras creabas el empleado.",
      });
  }
};

const mostrarEmpleados = async (req, res) => {
  try {
    const empleados = await prisma.empleado.findMany();
    res.status(200).json(empleados);
  } catch (error) {
    console.error("Error al obtener clientes", error);
    res
      .status(400)
      .json({
        error:
          error.message || "Un error ocurrió mientras obtenías los clientes.",
      });
  }
};

module.exports = {
  createUsuario,
  createCliente,
  mostrarClientes,
  createEmpleado,
  mostrarEmpleados,
};
