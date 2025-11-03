import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Obtener todas las marcas de herramientas
export const getAllMarcasHerramienta = async (req, res) => {
  try {
    const marcas = await prisma.marcaHerramienta.findMany({
      include: {
        _count: {
          select: { herramientas: true }
        }
      },
      orderBy: {
        nombre: 'asc'
      }
    });

    res.json(marcas);
  } catch (error) {
    console.error('Error al obtener marcas de herramientas:', error);
    res.status(500).json({ 
      error: 'Error al obtener marcas de herramientas',
      details: error.message 
    });
  }
};

// Obtener una marca de herramienta por ID
export const getMarcaHerramientaById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const marca = await prisma.marcaHerramienta.findUnique({
      where: { id: parseInt(id) },
      include: {
        herramientas: {
          orderBy: { nombre: 'asc' }
        },
        _count: {
          select: { herramientas: true }
        }
      }
    });

    if (!marca) {
      return res.status(404).json({ error: 'Marca de herramienta no encontrada' });
    }

    res.json(marca);
  } catch (error) {
    console.error('Error al obtener marca de herramienta:', error);
    res.status(500).json({ 
      error: 'Error al obtener marca de herramienta',
      details: error.message 
    });
  }
};

// Crear una nueva marca de herramienta
export const createMarcaHerramienta = async (req, res) => {
  try {
    const { nombre } = req.body;

    // Validaciones
    if (!nombre || nombre.trim() === '') {
      return res.status(400).json({ error: 'El nombre de la marca es obligatorio' });
    }

    // Verificar si ya existe una marca con ese nombre
    const marcaExistente = await prisma.marcaHerramienta.findFirst({
      where: {
        nombre: {
          equals: nombre.trim(),
          mode: 'insensitive'
        }
      }
    });

    if (marcaExistente) {
      return res.status(400).json({ error: 'Ya existe una marca con ese nombre' });
    }

    const marca = await prisma.marcaHerramienta.create({
      data: {
        nombre: nombre.trim()
      },
      include: {
        _count: {
          select: { herramientas: true }
        }
      }
    });

    res.status(201).json(marca);
  } catch (error) {
    console.error('Error al crear marca de herramienta:', error);
    res.status(500).json({ 
      error: 'Error al crear marca de herramienta',
      details: error.message 
    });
  }
};

// Actualizar una marca de herramienta
export const updateMarcaHerramienta = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;

    // Validaciones
    if (!nombre || nombre.trim() === '') {
      return res.status(400).json({ error: 'El nombre de la marca es obligatorio' });
    }

    // Verificar si existe la marca
    const marcaExiste = await prisma.marcaHerramienta.findUnique({
      where: { id: parseInt(id) }
    });

    if (!marcaExiste) {
      return res.status(404).json({ error: 'Marca de herramienta no encontrada' });
    }

    // Verificar si ya existe otra marca con ese nombre
    const marcaDuplicada = await prisma.marcaHerramienta.findFirst({
      where: {
        AND: [
          { id: { not: parseInt(id) } },
          {
            nombre: {
              equals: nombre.trim(),
              mode: 'insensitive'
            }
          }
        ]
      }
    });

    if (marcaDuplicada) {
      return res.status(400).json({ error: 'Ya existe otra marca con ese nombre' });
    }

    const marca = await prisma.marcaHerramienta.update({
      where: { id: parseInt(id) },
      data: {
        nombre: nombre.trim()
      },
      include: {
        _count: {
          select: { herramientas: true }
        }
      }
    });

    res.json(marca);
  } catch (error) {
    console.error('Error al actualizar marca de herramienta:', error);
    res.status(500).json({ 
      error: 'Error al actualizar marca de herramienta',
      details: error.message 
    });
  }
};

// Eliminar una marca de herramienta
export const deleteMarcaHerramienta = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si existe la marca
    const marca = await prisma.marcaHerramienta.findUnique({
      where: { id: parseInt(id) },
      include: {
        _count: {
          select: { herramientas: true }
        }
      }
    });

    if (!marca) {
      return res.status(404).json({ error: 'Marca de herramienta no encontrada' });
    }

    // Verificar si tiene herramientas asociadas
    if (marca._count.herramientas > 0) {
      return res.status(400).json({ 
        error: `No se puede eliminar la marca porque tiene ${marca._count.herramientas} herramienta(s) asociada(s)` 
      });
    }

    await prisma.marcaHerramienta.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Marca de herramienta eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar marca de herramienta:', error);
    res.status(500).json({ 
      error: 'Error al eliminar marca de herramienta',
      details: error.message 
    });
  }
};
