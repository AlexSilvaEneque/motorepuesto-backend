import detailSaleProduct from "../models/DetailSaleProduct.js"
import detailSaleService from "../models/DetailSaleService.js"
import Sale from "../models/Sale.js"
import { handleNotFoundError, validateObjectId } from "../utils/index.js"

const getSales = async (req, res) => {
    const sales = await Sale.find().select("-__v -tax -discount -detailProducts")
        .populate({ path: 'client', select: 'name'})

    res.json(sales)
}

const getSaleById = async (req, res) => {
    const { id } = req.params
    if (validateObjectId(id, res)) return

    const sale = await Sale.findById(id)
                                .populate({ path: 'detailProducts', populate: { path: 'products' } })
                                .populate({ path: 'detailServices', populate: { path: 'services' } })
                                .populate({ path: 'user', select: '_id first_name last_name'})
                                .populate('client')
    if (!sale) {
        return handleNotFoundError('La venta no existe', res)
    }

    res.json(sale)
}

const newSale = async (req, res) => {

    if (!req.body.detailProducts && !req.body.detailServices) {
        return res.status(401).json({
            msg: 'Debes agregar un producto o servicio'
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

        const IdPsave = await bdetailProducts

        let bdetailServices = req.body.detailServices
        if (bdetailServices) {
            bdetailServices = Promise.all(bdetailServices.map(async (detail) => {
                let newDetail = new detailSaleService(detail)
                newDetail = await newDetail.save()
                return newDetail._id
            }))
        }

        const IdSsave = await bdetailServices

        let totalPricePro = []
        let totalPriceSer = []
        
        if (IdPsave) {
            totalPricePro = await Promise.all(IdPsave.map(async (item) => {
                const detail = await detailSaleProduct.findById(item).populate('products')
                const subtotal = parseFloat(detail.products.price.toString()) * detail.quantity
                return subtotal
            }))            
        }

        if (IdSsave) {
            totalPriceSer = await Promise.all(IdSsave.map(async (item) => {
                const detail = await detailSaleService.findById(item).populate('services')
                const subtotal = parseFloat(detail.services.price.toString()) * detail.quantity
                return subtotal
            }))   
        }

        const totalPrice = [...totalPricePro, ...totalPriceSer]

        const totalSale = totalPrice.reduce((a,b) => a + b, 0)

        const sale = req.body
        sale.total = totalSale
        sale.user = req.user._id.toString()
        sale.detailProducts = IdPsave
        sale.detailServices = IdSsave
        
        const newSale = new Sale(sale)
        await newSale.save()

        res.json({
            msg: 'La venta se registró correctamente'
        })
        
    } catch (error) {
        console.log(error)
    }
}

const updateSale = async (req, res) => {
    const { id } = req.params
    if (validateObjectId(id, res)) return

    const sale = await Sale.findById(id).populate('services').populate('products')
    if (!sale) {
        return handleNotFoundError('La venta no existe', res)
    }

    const { date, payment_type, total, discount, services, products, client } = req.body
    sale.date = date
    sale.payment_type = payment_type
    sale.total = total
    sale.discount = discount
    sale.services = services
    sale.products = products
    sale.client = client

    try {
        await sale.save()
        res.json({
            msg: 'Venta actualizada correctamente'
        })
    } catch (error) {
        console.log(error)
    }
}

const deleteSale = async (req, res) => {
    const { id } = req.params
    if (validateObjectId(id, res)) return

    const sale = await Sale.findById(id)
    if (!sale) {
        return handleNotFoundError('La venta no existe', res)
    }

    sale.status = false
    try {
        await sale.save()
        res.json({
            msg: 'Venta eliminada'
        })
    } catch (error) {
        console.log(error)
    }
}

export {
    getSales,
    getSaleById,
    newSale,
    updateSale,
    deleteSale
}