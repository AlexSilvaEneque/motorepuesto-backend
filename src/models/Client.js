import mongoose from "mongoose"

const clientSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: Number,
        required: true
    },
    doc: {
        type: String,
        required: true
    },
    address: {
        type: String,
        default: ''
    },
    phone: {
        type: String,
        default: ''
    },
    status: {
        type: Boolean,
        default: true
    }
})

const Client = mongoose.model('Client', clientSchema)

export default Client