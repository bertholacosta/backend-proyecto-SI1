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
      return res.status(409).json({ 
        success: false,
        error: "Cliente ya existe" 
      });
    }
    const newCliente = await prisma.cliente.create({
      data: {
        ci: ci1,
        nombre,
        telefono,
        direccion,
      },
    });
    res.status(201).json({
      success: true,
      message: "Cliente creado exitosamente",
      data: newCliente
    });
  } catch (error) {
    console.error("Error al crear cliente", error);
    res
      .status(400)
      .json({
        success: false,
        error: error.message || "Un error ocurrió mientras creabas el cliente.",
      });
  }
};
// mostrar clientes

const mostrarClientes = async (req, res) => {
  try {
    const clientes = await prisma.cliente.findMany();
    res.status(200).json({
      success: true,
      data: clientes
    });
  } catch (error) {
    console.error("Error al obtener clientes", error);
    res
      .status(400)
      .json({
        success: false,
        error:
          error.message || "Un error ocurrió mientras obtenías los clientes.",
      });
  }
};

// obtener cliente por ID
const obtenerCliente = async (req, res) => {
  const { id } = req.params;
  try {
    const cliente = await prisma.cliente.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    if (!cliente) {
      return res.status(404).json({ 
        success: false,
        error: "Cliente no encontrado" 
      });
    }
    res.status(200).json({
      success: true,
      data: cliente
    });
  } catch (error) {
    console.error("Error al obtener cliente", error);
    res.status(400).json({
      success: false,
      error: error.message || "Un error ocurrió mientras obtenías el cliente.",
    });
  }
};

// actualizar cliente
const actualizarCliente = async (req, res) => {
  const { id } = req.params;
  const { ci, nombre, telefono, direccion } = req.body;
  try {
    // Verificar si el cliente existe
    const clienteExistente = await prisma.cliente.findUnique({
      where: { id: parseInt(id) },
    });
    
    if (!clienteExistente) {
      return res.status(404).json({ 
        success: false,
        error: "Cliente no encontrado" 
      });
    }

    // Validar los datos si se proporcionan
    if (ci !== undefined) {
      const ci1 = Number(ci);
      Validaciones.ci(ci1);
      
      // Verificar que no exista otro cliente con el mismo CI
      const clienteConMismoCI = await prisma.cliente.findUnique({
        where: { ci: ci1 },
      });
      
      if (clienteConMismoCI && clienteConMismoCI.id !== parseInt(id)) {
        return res.status(409).json({ 
          success: false,
          error: "Ya existe un cliente con ese CI" 
        });
      }
    }
    
    if (nombre !== undefined) Validaciones.nombre(nombre);
    if (telefono !== undefined) Validaciones.telefono(telefono);
    if (direccion !== undefined) Validaciones.direccion(direccion);

    const clienteActualizado = await prisma.cliente.update({
      where: { id: parseInt(id) },
      data: {
        ...(ci !== undefined && { ci: Number(ci) }),
        ...(nombre !== undefined && { nombre }),
        ...(telefono !== undefined && { telefono }),
        ...(direccion !== undefined && { direccion }),
      },
    });
    
    res.status(200).json({
      success: true,
      message: "Cliente actualizado exitosamente",
      data: clienteActualizado
    });
  } catch (error) {
    console.error("Error al actualizar cliente", error);
    res.status(400).json({
      success: false,
      error: error.message || "Un error ocurrió mientras actualizabas el cliente.",
    });
  }
};

// eliminar cliente
const eliminarCliente = async (req, res) => {
  const { id } = req.params;
  try {
    // Verificar si el cliente existe
    const cliente = await prisma.cliente.findUnique({
      where: { id: parseInt(id) },
    });
    
    if (!cliente) {
      return res.status(404).json({ 
        success: false,
        error: "Cliente no encontrado" 
      });
    }

    await prisma.cliente.delete({
      where: { id: parseInt(id) },
    });
    
    res.status(200).json({
      success: true,
      message: "Cliente eliminado exitosamente"
    });
  } catch (error) {
    console.error("Error al eliminar cliente", error);
    res.status(400).json({
      success: false,
      error: error.message || "Un error ocurrió mientras eliminabas el cliente.",
    });
  }
};

module.exports = {
  createCliente,
  mostrarClientes,
  obtenerCliente,
  actualizarCliente,
  eliminarCliente
};
