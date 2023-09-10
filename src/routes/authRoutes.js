import express from 'express'
import { login, user, admin } from '../controllers/authController.js'
import authMiddleware from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post('/login', login)

router.get('/user', authMiddleware, user)
router.get('/admin', authMiddleware, admin)

export default router