import mongoose from "mongoose";

const detailSaleServiceSchema = mongoose.Schema({
    quantity: {
        type: Number,
        required: true
    },
    services: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service'
    }
})

const detailSaleService = mongoose.model('DetailSaleService', detailSaleServiceSchema)

export default detailSaleService