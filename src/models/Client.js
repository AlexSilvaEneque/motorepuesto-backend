import mongoose from "mongoose"

const clientSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    dni: {
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