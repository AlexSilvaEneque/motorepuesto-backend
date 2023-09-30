import mongoose from "mongoose";

const ServiceSchema = mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    price: {
        type: mongoose.Schema.Types.Decimal128,
        required: true
    },
    status:{
        type: Boolean,
        default: true
    }
})

const Service = mongoose.model('Service', ServiceSchema)

export default Service