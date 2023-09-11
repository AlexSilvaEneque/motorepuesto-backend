import express from "express"
import { deleteUser, getAll, getById, register, update } from "../controllers/userController.js"
import authMiddleware from "../middlewares/authMiddleware.js"

const router = express.Router()

router.route('/')
    .get(authMiddleware, getAll)
    .post(register)

router.route('/:id')
    .get(getById)
    .put(update)
    .delete(deleteUser)

export default router