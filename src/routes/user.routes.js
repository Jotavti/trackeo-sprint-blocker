// RUTAS DE USUARIOS
// Define los endpoints para gestionar usuarios.
// Solo el PM puede acceder — requiere JWT válido y rol pm.
//
// GET /api/users → devuelve la lista completa de usuarios del equipo

import { Router } from 'express';
import userController from '../controllers/user.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import roleMiddleware from '../middlewares/role.middleware.js';

const router = Router();

router.get('/', authMiddleware, roleMiddleware('pm'), userController.getAll);

export default router;
