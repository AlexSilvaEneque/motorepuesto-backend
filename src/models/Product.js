import mongoose from "mongoose";
 
const ProductSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: mongoose.Schema.Types.Decimal128,
        required: true
    },
    quantity: {
        type: Number,
        default: 0
    },
    type: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    }
})

const Product = mongoose.model('Product', ProductSchema)

export default Product