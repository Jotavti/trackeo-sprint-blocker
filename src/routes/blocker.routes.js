// RUTAS DE BLOCKERS
// Define todos los endpoints para gestionar impedimentos de sprint.
// Todos requieren JWT válido (authMiddleware aplicado globalmente al router).
// Algunos además requieren un rol específico (roleMiddleware).
//
// El flujo de cada request es:
//   authMiddleware → [roleMiddleware] → controller
//
// GET    /api/blockers           → cualquier usuario autenticado (el controller filtra por rol)
// GET    /api/blockers/:id       → cualquier usuario autenticado
// POST   /api/blockers           → solo dev (crea un blocker propio)
// PUT    /api/blockers/:id       → cualquier autenticado (el controller valida propiedad)
// PATCH  /api/blockers/:id/status → solo PM (cambia el estado del blocker)
// DELETE /api/blockers/:id       → solo PM (elimina el blocker)

import { Router } from 'express';
import blockerController from '../controllers/blocker.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import roleMiddleware from '../middlewares/role.middleware.js';

const router = Router();

// Aplica authMiddleware a todas las rutas de este router
router.use(authMiddleware);

router.get('/',              blockerController.getAll);
router.get('/:id',           blockerController.getById);
router.post('/',             roleMiddleware('dev'), blockerController.create);
router.put('/:id',           blockerController.update);
router.patch('/:id/status',  roleMiddleware('pm'), blockerController.updateStatus);
router.delete('/:id',        roleMiddleware('pm'), blockerController.remove);

export default router;
