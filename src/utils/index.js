import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'

const generateJWT = (id) => {
    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '5d'
    })
    return token
}

const validateObjectId = (id, res) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error('El ID no es válido')
        return res.status(400).json({
            msg: error.message
        })
    }
}

const handleNotFoundError = (message, res) => {
    const error = new Error(message)
    return res.status(404).json({
        msg: error.message
    })
}

const converttoMMDDYYYY = (date) => {
    const [day, month, year] = date.split('/')
    return new Date(`${month}/${day}/${year}`)
}

export {
    generateJWT,
    validateObjectId,
    handleNotFoundError,
    converttoMMDDYYYY
}