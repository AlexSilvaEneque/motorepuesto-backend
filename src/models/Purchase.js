import mongoose from "mongoose"

const purchaseSchema = mongoose.Schema({
    date: {
        type: Date,
        default: Date.now()
    },
    total: {
        type: mongoose.Schema.Types.Decimal128,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier'
    },
    detailProducts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DetailSaleProduct'
    }]
})

const Purchase = mongoose.model('Purchase', purchaseSchema)

export default Purchase