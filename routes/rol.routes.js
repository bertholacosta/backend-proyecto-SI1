import express from 'express';
import * as rolController from '../controllers/rol.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// GET /api/roles - Obtener todos los roles
router.get('/', authenticate, rolController.getAllRoles);

// GET /api/roles/:id - Obtener un rol por ID
router.get('/:id', authenticate, rolController.getRolById);

// POST /api/roles - Crear un nuevo rol
router.post('/', authenticate, rolController.createRol);

// PUT /api/roles/:id - Actualizar un rol
router.put('/:id', authenticate, rolController.updateRol);

// DELETE /api/roles/:id - Eliminar un rol
router.delete('/:id', authenticate, rolController.deleteRol);

// POST /api/roles/:id/permisos - Asignar permisos a un rol
router.post('/:id/permisos', authenticate, rolController.assignPermisosToRol);

export default router;
