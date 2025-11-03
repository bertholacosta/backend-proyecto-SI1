import express from 'express';
import * as empleadoController from '../controllers/empleado.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// GET /api/empleados - Obtener todos los empleados
router.get('/', authenticate, empleadoController.getAllEmpleados);

// GET /api/empleados/:ci - Obtener un empleado por CI
router.get('/:ci', authenticate, empleadoController.getEmpleadoById);

// POST /api/empleados - Crear un nuevo empleado
router.post('/', authenticate, empleadoController.createEmpleado);

// PUT /api/empleados/:ci - Actualizar un empleado
router.put('/:ci', authenticate, empleadoController.updateEmpleado);

// DELETE /api/empleados/:ci - Eliminar un empleado
router.delete('/:ci', authenticate, empleadoController.deleteEmpleado);

export default router;
