import mongoose from 'mongoose'

const roleSchema = mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },

    status:{
        type: Boolean,
        default : true
    }
})

const Role = mongoose.model('Role', roleSchema)

export default Role