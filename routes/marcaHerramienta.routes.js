import express from 'express';
import {
  getAllMarcasHerramienta,
  getMarcaHerramientaById,
  createMarcaHerramienta,
  updateMarcaHerramienta,
  deleteMarcaHerramienta
} from '../controllers/marcaHerramienta.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Aplicar middleware de autenticación a todas las rutas
router.use(authenticate);

// Rutas para marcas de herramientas
router.get('/', getAllMarcasHerramienta);
router.get('/:id', getMarcaHerramientaById);
router.post('/', createMarcaHerramienta);
router.put('/:id', updateMarcaHerramienta);
router.delete('/:id', deleteMarcaHerramienta);

export default router;
