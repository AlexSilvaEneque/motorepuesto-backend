import express from 'express'
import { saleDate, purchaseDate, reportEmployee, reportClient } from '../controllers/reportsController.js'

const router = express.Router()

router.post('/sale', saleDate)
router.post('/purchase', purchaseDate)

router.get('/employee', reportEmployee)
router.get('/client', reportClient)

export default router