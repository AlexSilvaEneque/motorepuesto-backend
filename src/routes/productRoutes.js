import express from 'express'
import { allProduct, getById, newProduct } from '../controllers/productController.js'

const router = express.Router()

router.route('/')
    .get(allProduct)
    .post(newProduct)

router.route('/:id')
    .get(getById)

export default router