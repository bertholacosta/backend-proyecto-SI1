require("dotenv").config();
const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();
const Validaciones = require("../utils/validaciones");

//crear empleado

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
  createEmpleado,
  mostrarEmpleados
};


