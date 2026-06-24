// RUTAS DE AUTENTICACIÓN
// Define los endpoints públicos de la API (no requieren JWT).
// Su único trabajo es mapear cada ruta a su función en el controller.
// No hay lógica de negocio acá — solo el mapeo ruta → controller.
//
// POST /api/auth/register → registra un usuario nuevo (nombre, email, password, rol)
// POST /api/auth/login    → valida credenciales y devuelve un JWT

import { Router } from 'express';
import authController from '../controllers/auth.controller.js';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);

export default router;
