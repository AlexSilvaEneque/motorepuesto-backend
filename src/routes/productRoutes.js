import express from 'express'
import { allProduct, deteleProduct, getById, newProduct, update } from '../controllers/productController.js'
import authMiddleware from '../middlewares/authMiddleware.js'

const router = express.Router()

router.route('/')
    .get(authMiddleware, allProduct)
    .post(newProduct)

router.route('/:id')
    .get(getById)
    .put(update)
    .patch(deteleProduct)

export default router