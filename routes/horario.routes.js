import express from 'express';
import * as horarioController from '../controllers/horario.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Rutas de horarios
router.get('/', authenticate, horarioController.getAllHorarios);
router.get('/semana', authenticate, horarioController.getHorariosSemana);
router.get('/empleados', authenticate, horarioController.getHorariosEmpleados);
router.get('/:id', authenticate, horarioController.getHorarioById);
router.post('/', authenticate, horarioController.createHorario);
router.put('/:id', authenticate, horarioController.updateHorario);
router.delete('/:id', authenticate, horarioController.deleteHorario);

// Rutas de asignación de horarios a empleados
router.post('/asignar', authenticate, horarioController.asignarHorarioEmpleado);
router.delete('/asignar/:empleadoCi/:horarioId', authenticate, horarioController.eliminarHorarioEmpleado);

export default router;
