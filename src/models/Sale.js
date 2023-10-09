import mongoose from "mongoose"

const saleSchema = mongoose.Schema({
    date: {
        type: Date,
        default: Date.now()
    },
    payment_type: {
        type: String,
        required: true
    },
    tax: {
        type: mongoose.Schema.Types.Decimal128,
        default: 0.18
    },
    total: {
        type: mongoose.Schema.Types.Decimal128,
        required: true
    },
    discount: {
        type: mongoose.Schema.Types.Decimal128,
        default: 0.00
    },
    status: {
        type: Boolean,
        default: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client'
    },
    detailProducts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DetailSaleProduct'
    }],
    detailServices: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DetailSaleService'
    }],
})

const Sale = mongoose.model('Sale', saleSchema)

export default Sale