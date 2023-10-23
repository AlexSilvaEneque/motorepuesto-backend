import mongoose from 'mongoose'

const IncomeExpenseSchema = mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now()
    },
    initial_date: {
        type: Date,
        required: true
    },
    finish_date: {
        type: Date,
        required: true
    },
    detail_incomes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DetailIncome'
    }],
    detail_expenses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DetailExpense'
    }],
    total_income: { // ventas
        type: mongoose.Schema.Types.Decimal128,
        required: true
    },
    total_expense: { // gastos/compras
        type: mongoose.Schema.Types.Decimal128,
        required: true
    }
})

const IncomeExpense = mongoose.model('IncomeExpense', IncomeExpenseSchema)

export default IncomeExpense