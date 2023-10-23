import mongoose from "mongoose";

const DetailIncomeSchema = mongoose.Schema({
    sale: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sale'
    }
})

const DetailIncome = mongoose.model('DetailIncome', DetailIncomeSchema)

export default DetailIncome