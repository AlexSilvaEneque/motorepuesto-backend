import express from 'express'
import { allClient, deleteClient, getById, newClient, update } from '../controllers/clientController.js'
import authMiddleware from '../middlewares/authMiddleware.js'

const router = express.Router()

router.route('/')
    .get(authMiddleware, allClient)
    .post(newClient)

router.route('/:id')
    .get(getById)
    .put(update)
    .patch(deleteClient)

export default router