import express from 'express'
import { allService, deleteService, getById, newService, update } from '../controllers/serviceController.js'
import authMiddleware from '../middlewares/authMiddleware.js'

const router = express.Router()

router.route('/')
    .get(authMiddleware, allService)
    .post(newService)

router.route('/:id')
    .get(getById)
    .put(update)
    .patch(deleteService)


export default router