require("dotenv").config();
const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();
const Validaciones = require("../utils/validaciones");

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

module.exports = {
  createCliente,
  mostrarClientes
};
