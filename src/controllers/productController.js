import Product from "../models/Product.js"
import { handleNotFoundError, validateObjectId } from "../utils/index.js"

const allProduct = async (req, res) =>{
    let role = req.user.role.description.toLowerCase().includes('admin') ? true : false
    const products = await Product.find({
        status:true
    })
    res.json({
        products,
        isAdmin: role
    })
}

const getById = async (req, res) => {
    const { id } = req.params
    if (validateObjectId(id, res)) return

    const product = await Product.findById(id)

    if (!product) {
        return handleNotFoundError('El producto no existe', res)
    }
    res.json(product)
}

const newProduct = async (req, res) => {
    const { name, price } = req.body

    if (!name || !price) {
        const error = new Error('Envia los campos obligatorios')
        return res.status(401).json({
            msg: error.message
        })
    }

    try {
        const product = new Product(req.body)
        await product.save()
        res.json({
            msg: 'Producto registrado correctamente'
        })
    } catch (error) {
        console.log(error)
    }
}

const update = async (req, res) => {
    const { id } = req.params

    if (validateObjectId(id, res)) return

    if (Object.keys(req.body).length <= 0) {
        const error = new Error('Envie los campos obligatorios')
        return res.status(404).json({
            msg: error.message
        })
    }

    const product = await Product.findById(id)
    if (!product) {
        return handleNotFoundError('El cliente no existe',res)
    }

    const {name, price, quantity, type} = req.body
    if (!name || !price) {
        const error = new Error('Llene todos los datos requeridos')
        return res.status(400).json({
            msg: error.message
        })
    }

    product.name = name
    product.price = price
    product.quantity = quantity
    product.type = type

    try {
        await product.save()
        res.json({
            msg: 'Datos actualizados'
        })
    } catch (error) {
        console.log(error)
    }
}

const deteleProduct = async (req,res) => {
    const { id } = req.params
    if (validateObjectId(id,res)) return

    const product = await Product.findById(id)
    if (!product) {
        return handleNotFoundError('El Producto no existe', res)
    }

    product.status = false
    try {
        await product.save()
        res.json({
            msg: 'Producto eliminado'
        })
    } catch (error) {
        console.log(error)
    }
}

export {allProduct, getById, newProduct, update, deteleProduct}