import { Router } from 'express';
import { 
  getTasks, 
  getTaskById, 
  createTask, 
  updateTaskStatus, 
  deleteTask 
} from '../controller/tasks.controller';

const router = Router();

router.get('/', getTasks);
router.get('/:id', getTaskById);
router.post('/', createTask);
router.patch('/:id', updateTaskStatus);
router.delete('/:id', deleteTask);

export default router;