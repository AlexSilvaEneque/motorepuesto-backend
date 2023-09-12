import Client from "../models/Client.js"
import { handleNotFoundError, validateObjectId } from "../utils/index.js"

const allClient = async (req, res) => {
    let role = req.user.role.description.toLowerCase().includes('admin') ? true : false
    const clients = await Client.find({
        status:true
    })
    res.json({
        clients,
        isAdmin: role
    })
}

const getById = async (req, res) => {
    const { id } = req.params
    if (validateObjectId(id, res)) return

    const client = await Client.findById(id)

    if (!client) {
        return handleNotFoundError('El cliente no existe', res)
    }
    res.json(client)
}

const newClient  = async (req, res) => {
    const { name, last_name, dni } = req.body

    if (!name && !last_name && !dni) {
        const error = new Error('Envia los campos obligatorios')
        return res.status(401).json({
            msg: error.message
        })
    }
    
    try {
        const client = new Client(req.body)
        await client.save()
        res.json({
            msg: 'Cliente registrado correctamente'
        })
    } catch (error) {
        console.log(error)
    }
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

    const client = await Client.findById(id)
    if (!client) {
        return handleNotFoundError('El cliente no existe', res)
    }

    const { name, last_name, dni, address, phone } = req.body

    if (!name && !last_name && !dni) {
        const error = new Error('LLene los campos obligatorios.')
        return res.status(400).json({
            msg: error.message
        })
    }

    client.name = name
    client.last_name = last_name
    client.dni = dni
    client.address = address || client.address
    client.phone = phone || client.phone

    try {
        await client.save()
        res.json({
            msg: 'Datos actualizados'
        })
    } catch (error) {
        console.log(error)
    }
}

const deleteClient = async (req, res) => {
    const { id } = req.params
    if (validateObjectId(id, res)) return

    const client = await Client.findById(id)

    if (!client) {
        return handleNotFoundError('El cliente no existe', res)
    }

    client.status = false
    try {
        await client.save()
        res.json({
            msg: 'Cliente eliminado'
        })
    } catch (error) {
        console.log(error)
    }
}

export {
    allClient,
    getById,
    newClient,
    update,
    deleteClient
}