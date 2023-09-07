import { syncIndexes } from "mongoose"
import Product from "../models/Product.js"
import { handleNotFoundError, validateObjectId } from "../utils/index.js"

const allProduct = async (req, res) =>{
    const products = await Product.find()
    res.json(products)
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
    const { name, price, quantity } = req.body

    if (!name || !price || !quantity) {
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

// const update = async (req, res) => {
//     const { id } = req.params

//     if (validateObjectId(id, res)) return

//     if (Object.keys(req.body).length <= 0) {
//         const error = new Error('Envie los campos obligatorios')
//         return res.status(404).json({
//             msg: error.message
//         })
//     }
// }

export {allProduct, getById, newProduct}