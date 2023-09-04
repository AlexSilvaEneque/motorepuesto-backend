import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import { db } from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import roleRoutes from './routes/roleRoutes.js'

dotenv.config()

const app = express()

app.use(express.json())

db()

const whiteList = [process.env.FRONTEND_URL]

if (process.argv[2] === '--postman') {
    whiteList.push(undefined)
}

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

app.use(cors(corsOptions))

app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/rol', roleRoutes)

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
    console.log('conectado' + PORT)
})