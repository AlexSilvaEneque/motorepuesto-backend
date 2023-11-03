import express from 'express'
import { allInformation } from '../controllers/dashboardController.js'

const router = express.Router()

router.get('/', allInformation)

export default router