import User from "../models/User.js"
import { handleNotFoundError, validateObjectId } from "../utils/index.js"

const register = async (req, res) => {
    const { email, password, first_name, last_name, role } = req.body
    
    if (!email || !password || !first_name || !last_name || !role) {
        const error = new Error('LLene los campos obligatorios.')
        return res.status(400).json({
            msg: error.message
        })
    }

    const userExists = await User.findOne({ email })
    if (userExists) {
        const error = new Error('Email en uso')
        return res.status(400).json({
            msg: error.message
        })
    }

    const MIN_PASSWORD_LENGTH = 8
    if (password.trim().length < MIN_PASSWORD_LENGTH) {
        const error = new Error(`La contraseña debe tener como mínimo ${MIN_PASSWORD_LENGTH} caracteres.`)
        return res.status(400).json({
            msg: error.message
        })
    }

    try {
        const user = new User(req.body)
        await user.save()
        res.json({
            msg: 'Usuario registrado correctamente.'
        })
    } catch (error) {
        console.log(error)
    }
}

const getAll = async (req, res) => {
    const user = await User.find().select("-password")
    res.json({
        user
    })
}

const getById = async (req, res) => {
    const { id } = req.params
    if (validateObjectId(id, res)) return

    const user = await User.findById(id).populate('role')
        .select("-password")
    if (!user) {
        return handleNotFoundError('El usuario no existe', res)
    }

    res.json(user)
}

const update = async (req, res) => {
    const { id } = req.params
    if (validateObjectId(id, res)) return

    const user = await User.findById(id)
    if (!user) {
        return handleNotFoundError('El usuario no existe', res)
    }

    const { email, password, first_name, last_name, role, username, phone } = req.body
    
    if (!email || !password || !first_name || !last_name || !role) {
        const error = new Error('LLene los campos obligatorios.')
        return res.status(400).json({
            msg: error.message
        })
    }

    const MIN_PASSWORD_LENGTH = 8
    if (password.trim().length < MIN_PASSWORD_LENGTH) {
        const error = new Error(`La contraseña debe tener como mínimo ${MIN_PASSWORD_LENGTH} caracteres.`)
        return res.status(400).json({
            msg: error.message
        })
    }

    user.email = email
    user.password = password
    user.first_name = first_name
    user.last_name = last_name
    user.role = role
    user.username = username
    user.phone = phone
    
    try {
        await user.save()
        res.json({
            msg: 'Datos actualizados'
        })
    } catch (error) {
        console.log(error)
    }
    
}

const deleteUser = async (req, res) => {
    const { id } = req.params
    if (validateObjectId(id, res)) return

    const user = await User.findById(id)
    if (!user) {
        return handleNotFoundError('El usuario no existe', res)
    }

    user.status = false

    try {
        await user.save()
        res.json({
            msg: 'Usuario eliminado exitosamente'
        })
    } catch (error) {
        console.log(error)
    }
}

export {
    register,
    getAll,
    getById,
    update,
    deleteUser
}