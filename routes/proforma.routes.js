import express from 'express';
import * as proformaController from '../controllers/proforma.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// GET /api/proformas - Obtener todas las proformas (datos principales)
router.get('/', authenticate, proformaController.getAllProformas);

// GET /api/proformas/:id - Obtener una proforma completa con todos sus detalles
router.get('/:id', authenticate, proformaController.getProformaById);

// POST /api/proformas - Crear una nueva proforma
router.post('/', authenticate, proformaController.createProforma);

// PUT /api/proformas/:id - Actualizar una proforma
router.put('/:id', authenticate, proformaController.updateProforma);

// PATCH /api/proformas/:id/estado - Cambiar el estado de una proforma
router.patch('/:id/estado', authenticate, proformaController.cambiarEstado);

// DELETE /api/proformas/:id - Eliminar una proforma
router.delete('/:id', authenticate, proformaController.deleteProforma);

export default router;
