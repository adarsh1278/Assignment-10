import { Router } from 'express';
import * as dayStatusController from '../controllers/day-status.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

// Public
router.get('/', dayStatusController.getByYear);
router.get('/:date', dayStatusController.getByDate);

// Protected
router.post('/', requireAuth, dayStatusController.create);
router.put('/:date', requireAuth, dayStatusController.update);
router.delete('/:date', requireAuth, dayStatusController.remove);

export default router;
