require('dotenv').config();
const authMiddleware = require('../middlewares/authMiddleware');
const bitacora = require('../utils/bitacora').bitacora;
const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

exports.createmarcamoto = async (req, res) => {
    try {
        if (!req.body.nombre) {
            return res.status(422).json({ error: 'El campo nombre es obligatorio.' });
        }

        // Verificar si ya existe una marca con ese nombre
        const existingMarca = await prisma.marca_moto.findFirst({
            where: {
                nombre: req.body.nombre
            }
        });

        if (existingMarca) {
            return res.status(409).json({ error: 'La marca de moto ya existe.' });
        }
        await bitacora({
            req,
            res,
            descripcion: `Creación de nueva moto marca: ${req.body.nombre} por el usuario ${req.user.usuario}`,
          });
        const newmarcamoto = await prisma.marca_moto.create({
            data: {
                nombre: req.body.nombre
            }
        });

        return res.status(201).json(newmarcamoto);
    } catch (error) {
        console.error('Error al crear marca de moto:', error);
        return res.status(500).json({ error: 'Error interno del servidor.' });
    }
};