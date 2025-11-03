import express from 'express';
import {
  getAllHerramientas,
  getHerramientaById,
  getHerramientasByMarca,
  createHerramienta,
  updateHerramienta,
  deleteHerramienta
} from '../controllers/herramienta.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Aplicar middleware de autenticación a todas las rutas
router.use(authenticate);

// Rutas para herramientas
router.get('/', getAllHerramientas);
router.get('/marca/:marcaId', getHerramientasByMarca);
router.get('/:id', getHerramientaById);
router.post('/', createHerramienta);
router.put('/:id', updateHerramienta);
router.delete('/:id', deleteHerramienta);

export default router;
