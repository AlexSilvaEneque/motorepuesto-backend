import express from 'express'
import { deleteRole, getAll, getById, newRole, update } from '../controllers/rolesController.js'

const router = express.Router()

router.route('/')
    .get(getAll)
    .post(newRole)

router.route('/:id')
    .get(getById)
    .put(update)
    .delete(deleteRole)

export default router