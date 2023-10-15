import express from 'express'
import { createOrder, webhookOrder } from '../controllers/paymentController.js'
import registerBackURL from '../middlewares/registerBackURL.js'

const router = express.Router()

router.post('/create-order', createOrder)
router.get('/success', (req, res) => {
    res.redirect(process.env.FRONTEND_URL+'/payment/verify')
})
router.get('/failure', (req, res) => {
    res.redirect(process.env.FRONTEND_URL+'/payment/'+req.query.id_sale)
})
router.get('/pending', (req, res) => res.send('pending'))
router.post('/webhook', webhookOrder)

export default router