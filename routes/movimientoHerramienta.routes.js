import express from 'express';
import {
  getAllMovimientosHerramienta,
  getMovimientosByOrden,
  getMovimientosByHerramienta,
  getMovimientoById,
  createMovimientoHerramienta,
  updateMovimientoHerramienta,
  deleteMovimientoHerramienta
} from '../controllers/movimientoHerramienta.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Aplicar middleware de autenticación a todas las rutas
router.use(authenticate);

// Rutas para movimientos de herramientas
router.get('/', getAllMovimientosHerramienta);
router.get('/orden/:ordenTrabajoId', getMovimientosByOrden);
router.get('/herramienta/:herramientaId', getMovimientosByHerramienta);
router.get('/:ordenTrabajoId/:herramientaId', getMovimientoById);
router.post('/', createMovimientoHerramienta);
router.put('/:ordenTrabajoId/:herramientaId', updateMovimientoHerramienta);
router.delete('/:ordenTrabajoId/:herramientaId', deleteMovimientoHerramienta);

export default router;
