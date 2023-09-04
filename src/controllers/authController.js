import User from "../models/User.js"
import { generateJWT } from "../utils/index.js"

const login = async (req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
        const error = new Error('El usuario no existe')
        return res.status(404).json({
            msg: error.message
        })
    }

    if (await user.checkPassword(password)) {
        const token = generateJWT(user._id)
        res.json({
            token
        })
    } else {
        const error = new Error('La contraseña es incorrecta')
        return res.status(401).json({
            msg: error.message
        })
    }
}

const user = async (req, res) => {
    const { user } = req
    res.json(user)
}

export {
    login,
    user
}