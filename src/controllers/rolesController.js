import Role from "../models/Role.js"
import { validateObjectId } from "../utils/index.js"

const getAll = async (req, res) => {
    const roles = await Role.find()
    res.json({
        roles
    })
}

const newRole = async (req, res) => {
    if (Object.keys(req.body).length <= 0) {
        const error = new Error('Envíe los campos obligatorios')
        return res.status(400).json({
            msg: error.message
        })
    }

    if (Object.values(req.body).includes('')) {
        const error = new Error('Llene los campos obligatorios')
        return res.status(400).json({
            msg: error.message
        })
    }

    try {
        const role = new Role(req.body)
        await role.save()
        res.json({
            msg: 'Rol registrado correctamente'
        })
    } catch (error) {
        console.log(error)
    }
}

const getById = async (req, res) => {
    const { id } = req.params
    if (validateObjectId(id, res)) return

    const rol = await Role.findById(id)
    if (!rol) {
        return handleNotFoundError('El rol no existe', res)
    }

    res.json(rol)
}

const update = async (req, res) => {
    const { id } = req.params
    if (validateObjectId(id, res)) return

    if (Object.keys(req.body).length <= 0) {
        const error = new Error('Envíe los campos obligatorios')
        return res.status(400).json({
            msg: error.message
        })
    }

    const rol = await Role.findById(id)
    if (!rol) {
        return handleNotFoundError('El rol no existe', res)
    }

    const { description } = req.body
    rol.description = description || rol.description
    try {
        await rol.save()
        res.json({
            msg: 'Rol actualizado.'
        })
    } catch (error) {
        console.log(error)
    }
}

const deleteRole = async (req, res) => {
    const { id } = req.params
    if (validateObjectId(id, res)) return

    const rol = await Role.findById(id)
    if (!rol) {
        return handleNotFoundError('El rol no existe', res)
    }

    rol.status = false
    try {
        await rol.save()
        res.json({
            msg: 'Rol eliminado exitosamente'
        })
    } catch (error) {
        console.log(error)
    }
}

export {
    getAll,
    newRole,
    getById,
    update,
    deleteRole
}