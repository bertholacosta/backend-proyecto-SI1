import express from 'express';
import * as authController from '../controllers/auth.controller.js';

const router = express.Router();

// POST /api/auth/login - Iniciar sesión
router.post('/login', authController.login);

// POST /api/auth/register - Registrar usuario
router.post('/register', authController.register);

export default router;
