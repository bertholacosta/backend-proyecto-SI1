import express from 'express';
import * as permisoController from '../controllers/permiso.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// GET /api/permisos - Obtener todos los permisos
router.get('/', authenticate, permisoController.getAllPermisos);

// GET /api/permisos/:id - Obtener un permiso por ID
router.get('/:id', authenticate, permisoController.getPermisoById);

// POST /api/permisos - Crear un nuevo permiso
router.post('/', authenticate, permisoController.createPermiso);

// PUT /api/permisos/:id - Actualizar un permiso
router.put('/:id', authenticate, permisoController.updatePermiso);

// DELETE /api/permisos/:id - Eliminar un permiso
router.delete('/:id', authenticate, permisoController.deletePermiso);

export default router;
