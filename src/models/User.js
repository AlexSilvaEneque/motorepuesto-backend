import mongoose from "mongoose"
import bcrypt from 'bcrypt'

const userSchema = mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        trim: true
    },
    last_name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        uniqued: true,
        lowercase: true
    },
    username: {
        type: String,
        trim: true,
        default: ''
    },
    phone: {
        type: String,
        default: ''
    },
    password: {
        type: String,
        require: true
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role'
    },
    status:{
        type: Boolean,
        default : true
    }
})

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next()
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.checkPassword = async function(inputPassword) {
    return await bcrypt.compare(inputPassword, this.password)
}

const User = mongoose.model('User', userSchema)

export default User