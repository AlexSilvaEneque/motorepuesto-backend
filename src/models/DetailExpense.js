import mongoose from "mongoose";

const DetailExpenseSchema = mongoose.Schema({
    purchase: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Purchase'
    }
})

const DetailExpense = mongoose.model('DetailExpense', DetailExpenseSchema)

export default DetailExpense