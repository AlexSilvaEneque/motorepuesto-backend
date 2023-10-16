import detailSaleProduct from "../models/DetailSaleProduct.js"
import Product from "../models/Product.js"
import Purchase from "../models/Purchase.js"
import { handleNotFoundError, validateObjectId } from "../utils/index.js"

const getPurchase = async (req, res) => {
    const role = req.user.role.description.toLowerCase().includes('admin') ? true : false
    const purchases = await Purchase.find().select("-__v -detailProducts")
        .populate({ path: 'supplier', select: 'social_reason' })
        .sort('-date')
    res.json({
        purchases,
        isAdmin: role
    })
}

const getPurchaseById = async (req, res) => {
    const { id } = req.params
    if (validateObjectId(id, res)) return

    const purchase = await Purchase.findById(id)
                                    .populate({ path: 'detailProducts', populate: { path: 'products' } })
                                    .populate({ path: 'user', select: '_id first_name last_name'})
                                    .populate('supplier')
    if (!purchase) {
        return handleNotFoundError('La compra no existe', res)
    }

    res.json(purchase)
}

const newPurhcase = async (req, res) => {
    if (!req.body.detailProducts) {
        return res.status(401).json({
            msg: 'Debes agregar productos'
        })
    }

    try {
        let bdetailProducts = req.body.detailProducts
        if (bdetailProducts) {
            bdetailProducts = Promise.all(bdetailProducts.map(async (detail) => {
                let newDetail = new detailSaleProduct(detail)
                newDetail = await newDetail.save()
                return newDetail._id
            }))
        }

        const IdPSave = await bdetailProducts

        let totalPrice = []

        if (IdPSave) {
            totalPrice = await Promise.all(IdPSave.map(async (item) => {
                const detail = await detailSaleProduct.findById(item).populate('products')
                if (detail.products.type === 1) {
                    const prod = await Product.findById(detail.products._id)
                    prod.quantity = prod.quantity + detail.quantity
                    await prod.save()
                }
                const subtotal = parseFloat(detail.products.price.toString()) * detail.quantity
                return subtotal
            }))
        }

        const totalPurchase = totalPrice.reduce((a, b) => a + b, 0)

        const purchase = req.body
        purchase.total = totalPurchase
        purchase.user = req.user._id.toString()
        purchase.detailProducts = IdPSave

        const newPurhcase = new Purchase(purchase)
        await newPurhcase.save()

        res.json({
            msg: 'La compra se registró correctamente'
        })

    } catch (error) {
        console.log(error)
    }
}

const deletePurchase = async (req, res) => {
    const { id } = req.params
    if (validateObjectId(id, res)) return

    const purchase = await Purchase.finById(id)
    if (!purchase) {
        return handleNotFoundError('La compra no existe', res)
    }

    purchase.status = false
    try {
        await purchase.save()
        res.json({
            msg: 'Compra eliminada'
        })
    } catch (error) {
        console.log(error)
    }
}

export {
    getPurchase,
    getPurchaseById,
    newPurhcase,
    deletePurchase
}