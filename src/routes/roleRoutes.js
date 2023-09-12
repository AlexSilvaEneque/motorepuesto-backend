import express from 'express'
import { deleteRole, getAll, getById, newRole, update } from '../controllers/rolesController.js'
import authMiddleware from '../middlewares/authMiddleware.js'

const router = express.Router()

router.route('/')
    .get(authMiddleware, getAll)
    .post(newRole)

router.route('/:id')
    .get(getById)
    .put(update)
    .delete(deleteRole)

export default router