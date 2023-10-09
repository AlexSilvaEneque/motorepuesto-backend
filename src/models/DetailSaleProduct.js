import mongoose from "mongoose";

const detailSaleProductSchema = mongoose.Schema({
    quantity: {
        type: Number,
        required: true
    },
    products: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }
})

const detailSaleProduct = mongoose.model('DetailSaleProduct', detailSaleProductSchema)

export default detailSaleProduct