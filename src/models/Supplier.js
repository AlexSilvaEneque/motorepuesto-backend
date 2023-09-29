import mongoose from "mongoose";
 
const supplierSchema = mongoose.Schema({
    address: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        default: ''
    },
    social_reason: {
        type: String,
        required: true
    },
    representative: {
        type: String,
        required: true
    },
    phono: {
        type: String,
        required: true
    },
    status:{
        type: Boolean,
        default: true
    }
})

const Supplier = mongoose.model('Supplier', supplierSchema)

export default Supplier