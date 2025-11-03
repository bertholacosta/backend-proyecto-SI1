import express from 'express';
import * as diagnosticoController from '../controllers/diagnostico.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// GET /api/diagnosticos - Obtener todos los diagnósticos
router.get('/', authenticate, diagnosticoController.getAllDiagnosticos);

// GET /api/diagnosticos/:nro - Obtener un diagnóstico por NRO
router.get('/:nro', authenticate, diagnosticoController.getDiagnosticoById);

// POST /api/diagnosticos - Crear un nuevo diagnóstico con detalles
router.post('/', authenticate, diagnosticoController.createDiagnostico);

// PUT /api/diagnosticos/:nro - Actualizar un diagnóstico con detalles
router.put('/:nro', authenticate, diagnosticoController.updateDiagnostico);

// DELETE /api/diagnosticos/:nro - Eliminar un diagnóstico
router.delete('/:nro', authenticate, diagnosticoController.deleteDiagnostico);

export default router;
