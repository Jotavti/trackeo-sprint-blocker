import { Router } from 'express';
import blockerController from '../controllers/blocker.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import roleMiddleware from '../middlewares/role.middleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/', blockerController.getAll);
router.get('/:id', blockerController.getById);
router.post('/', roleMiddleware('dev'), blockerController.create);
router.put('/:id', blockerController.update);
router.patch('/:id/status', roleMiddleware('pm'), blockerController.updateStatus);
router.delete('/:id', roleMiddleware('pm'), blockerController.remove);

export default router;
