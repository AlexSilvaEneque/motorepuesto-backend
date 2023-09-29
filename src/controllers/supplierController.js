import Supplier from "../models/Supplier.js"
import { handleNotFoundError, validateObjectId } from "../utils/index.js"
 
const allSupplier = async (req, res) => {
    let role = req.user.role.description.toLowerCase().includes('admin') ? true : false
    const supplier = await Supplier.find({
        status: true
    })
    res.json({
        supplier,
        isAdmin: role
    })
}

const getById = async (req, res) =>{
    const { id } = req.params
    if (validateObjectId(id, res)) return

    const supplier = await Supplier.findById(id)

    if(!supplier){
        return handleNotFoundError('El proveedor no existe', res)
    }
    res.json(supplier)
}

const newSupplier = async (req, res) => {
    const { social_reason, representative, phono } = req.body

    if (!social_reason || !representative || !phono) {
        const error = new Error('Envia los campos obligatorios')
        return res.status(401).json({
            msg: error.message
        })
    }

    try {
        const supplier = new Supplier(req.body)
        await supplier.save()
        res.json({
            msg: 'Proveedor registrado correctamente'
        })
    } catch (error) {
        console.log(error)
    }
}

const update = async (req, res) => {
    const { id } = req.params

    if (validateObjectId(id,res)) return

    if (Object.keys(req.body).length <=0 ) {
        const error = new Error('Envie los campos obligatorios')
        return res.status(404).json({
            msg:error.message
        })
    }

    const supplier = await Supplier.findById(id)
    if (!supplier) {
        return handleNotFoundError('El proveedor no existe',res)
    }

    const { address, email, social_reason, representative, phono } = req.body

    if (!social_reason || !representative || !phono) {
        const error = new Error('Llene todos los campos requeridos', res)
        return res.status(400).json({
            msg:error.message
        })
    }

    supplier.address = address || supplier.address
    supplier.email = email || supplier.email
    supplier.social_reason = social_reason
    supplier.representative = representative
    supplier.phono = phono

    try {
        await supplier.save()
        res.json({
            msg: 'Datos actualizados'
        })
    } catch (error) {
        console.log(error)
    }
}

const deleteSupplier = async (req,res) => {
    const { id } = req.params

    if(validateObjectId(id,res)) return 

    const supplier = await Supplier.findById(id)

    if (!supplier) {
        return handleNotFoundError('El proveedor no existe', res)
    }

    supplier.status = false
    try {
        await supplier.save()
        res.json({
            msg: 'Proveedor eliminado'
        })
    } catch (error) {
        console.log(error)
    }
}


export { allSupplier, getById, newSupplier, update, deleteSupplier}