import express from "express"
import { allSupplier, deleteSupplier, getById, newSupplier, update } from "../controllers/supplierController.js"
import authMiddleware from "../middlewares/authMiddleware.js"

const router = express.Router()

router.route('/')
    .get(authMiddleware, allSupplier)
    .post(newSupplier)

router.route('/:id')
    .get(getById)
    .put(update)
    .patch(deleteSupplier)

export default router

