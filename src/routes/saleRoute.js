import express from "express"
import { deleteSale, getSaleById, getSales, newSale, updateSale } from "../controllers/saleController.js"
import authMiddleware from "../middlewares/authMiddleware.js"

const router = express.Router()

router.route('/')
    .get(getSales)
    .post(authMiddleware, newSale)

router.route('/:id')
    .get(getSaleById)
    .put(updateSale)
    .patch(deleteSale)

export default router