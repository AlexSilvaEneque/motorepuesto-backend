import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { db } from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import roleRoutes from './routes/roleRoutes.js'
import clientRoutes from './routes/clientRoutes.js'
import productRoutes from './routes/productRoutes.js'
import supplierRoutes from './routes/supplierRoutes.js'
import serviceRoutes from './routes/serviceRoutes.js'
import saleRoutes from './routes/saleRoute.js'
import paymentRoutes from './routes/paymentRoutes.js'
import purchaseRoutes from './routes/purchaseRoute.js'
import incomeExpenseRoutes from './routes/incomeExpenseRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'
import reportsRoutes from './routes/reportsRoutes.js'

dotenv.config()

const app = express()

app.use(express.json())

db()

const whiteList = [process.env.FRONTEND_URL, undefined]

// if (process.argv[2] === '--postman') {
//     whiteList.push(undefined)
// }

const corsOptions = {
    origin: function (origin, callback) {
        if (whiteList.includes(origin)) {
            // permitir conexion
            callback(null, true)
        } else {
            // denegar conexion
            callback(new Error('Error de CORS'))
        }
    }
}

app.use(cors())

app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/rol', roleRoutes)
app.use('/api/client', clientRoutes)
app.use('/api/product', productRoutes)
app.use('/api/supplier', supplierRoutes)
app.use('/api/service', serviceRoutes)
app.use('/api/sale', saleRoutes)
app.use('/api/payment', paymentRoutes)
app.use('/api/purchase', purchaseRoutes)
app.use('/api/income-expense', incomeExpenseRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/reports', reportsRoutes)

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
    console.log('conectado' + PORT)
})