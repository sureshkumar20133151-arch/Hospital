import { Router } from 'express';
import { DepartmentController } from '../controllers/department.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';

const router = Router();

router.get('/', DepartmentController.getAll);
router.get('/:slug', DepartmentController.getBySlug);
router.post('/', requireAuth, requireRole(['ADMIN', 'SUPER_ADMIN']), DepartmentController.create);

export default router;
