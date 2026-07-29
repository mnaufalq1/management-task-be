import { Router } from 'express';
import {
    getComments,
    getCommentById,
    createComment,
    updateComment,
    deleteComment
} from '../controller/comments.controller';

const router = Router();

router.get('/', getComments);
router.get('/:id', getCommentById);
router.post('/', createComment);
router.patch('/:id', updateComment);
router.delete('/:id', deleteComment);

export default router;