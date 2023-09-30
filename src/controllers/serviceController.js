import Service from "../models/Service.js";
import { handleNotFoundError, validateObjectId } from "../utils/index.js";

const allService = async (req,res) =>{
    let role = req.user.role.description.toLowerCase().includes('admin') ? true : false
    const services = await Service.find({
        status: true
    })
    res.json({
        services,
        isAdmin: role
    })
}

const getById = async (req, res) => {
    const { id } = req.params
    if (validateObjectId(id,res)) return
    
    const service = await Service.findById(id)

    if (!service) {
        return handleNotFoundError('El servicios no existe', res)
    }
    res.json(service)
}

const newService = async (req, res) => {
    const { description, price } = req.body

    if (!description || !price) {
        const error = new Error('Envia los campos obligatorios')
        return res.status(401).json({
            msg: error.message
        })
    }

    try {
        const service = new Service(req.body)
        await service.save()
        res.json({
            msg: 'Servicio registrado correctamente'
        })
    } catch (error) {
        console.log(error)
    }
}

const update = async (req,res) =>{
    const { id } = req.params

    if (validateObjectId(id, res)) return

    if (Object.keys(req.body).length <= 0) {
        const error = new Error('Envie los campos obligatoriros')
        return res.status(404).json({
            msg: error.message
        })
    }

    const service = await Service.findById(id)
    if (!service) {
        return handleNotFoundError('El servicio no existe', res)
    }

    const {description, price} = req.body
    if (!description || !price) {
        const error = new Error('Llene todos los datos requeridos')
        return res.status(400).json({
            msg: error.message
        })
    }

    service.description = description
    service.price = price

    try {
        await service.save()
        res.json({
            msg: 'Datos actualizados'
        })
    } catch (error) {
        console.log(error)
    }
}

const deleteService = async (req, res) =>{
    const { id } = req.params
    if (validateObjectId(id,res)) return

    const service = await Service.findById(id)
    if (!service) {
        return handleNotFoundError('El servicio no existe', res)
    }

    service.status = false
    try {
        await service.save()
        res.json({
            msg: 'Servicio eliminado'
        })
    } catch (error) {
        console.log(error)
    }
}

export {allService, getById, newService, update, deleteService}