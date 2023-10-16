import express from "express"
import { deletePurchase, getPurchase, getPurchaseById, newPurhcase } from "../controllers/purchaseController.js"
import authMiddleware from "../middlewares/authMiddleware.js"

const router = express.Router()

router.route('/')
    .get(authMiddleware, getPurchase)
    .post(authMiddleware, newPurhcase)

router.route('/:id')
    .get(getPurchaseById)
    .patch(deletePurchase)

export default router