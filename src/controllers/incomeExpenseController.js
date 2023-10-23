import DetailExpense from "../models/DetailExpense.js"
import DetailIncome from "../models/DetailIncome.js"
import IncomeExpense from "../models/IncomeExpense.js"
import Purchase from "../models/Purchase.js"
import Sale from "../models/Sale.js"
import { converttoMMDDYYYY, handleNotFoundError, validateObjectId } from "../utils/index.js"

const getAllIncomeExpenses = async (req, res) => {
    const incomeExpenses = await IncomeExpense.find()
    res.json(incomeExpenses)
}

const getById = async (req, res) => {
    const { id } = req.params
    if (validateObjectId(id, res)) return

    const incomeExpense = await IncomeExpense.findById(id)
                                    .populate({
                                        path: 'detail_incomes',
                                        populate: {
                                            path: 'sale',
                                            select: 'date discount total',
                                            populate: [
                                                { path: 'client', select: 'name' },
                                                { path: 'user', select: 'first_name last_name' }
                                            ]
                                        }
                                    })
                                    .populate({
                                        path: 'detail_expenses',
                                        populate: {
                                            path: 'purchase',
                                            select: 'date total',
                                            populate: [
                                                { path: 'user', select: 'first_name last_name' },
                                                { path: 'supplier', select: 'social_reason' },
                                            ]
                                        }
                                    })

    if (!incomeExpense) {
        return handleNotFoundError('El registro no existe', res)
    }

    res.json(incomeExpense)
}

// listar ventas y compras
const getDataByRangeDate = async (req, res) => {
    const { initial_date, finish_date } = req.query

    const format_initial = converttoMMDDYYYY(initial_date)
    const format_finish = converttoMMDDYYYY(finish_date)

    try {
        const sales = await Sale.find({
            date: { $gte: format_initial, $lte: format_finish }
        }).select('_id date total')
          .populate({ path: 'client', select: 'name' })
          .populate({ path: 'user', select: 'first_name last_name' })

        const purchases = await Purchase.find({
            date: { $gte: format_initial, $lte: format_finish }
        }).select('_id date total')
          .populate({ path: 'user', select: 'name' })
          .populate({ path: 'supplier', select: 'social_reason' })
    
        res.json({
            sales,
            purchases
        })
    } catch (error) {
        console.log(error)
    }
}

const getDataByRangeDate2 = async (req, res) => {
    const { initial_date, finish_date } = req.query

    const format_initial = converttoMMDDYYYY(initial_date)
    const format_finish = converttoMMDDYYYY(finish_date)

    try {
        const sales = await Sale.find({
            date: { $gte: format_initial, $lte: format_finish }
        }).select('_id total')

        const countsale = await Sale.find({
            date: { $gte: format_initial, $lte: format_finish }
        }).count()

        const purchases = await Purchase.find({
            date: { $gte: format_initial, $lte: format_finish }
        }).select('_id total')

        const countpurchases = await Purchase.find({
            date: { $gte: format_initial, $lte: format_finish }
        }).count()
    
        res.json({
            sales,
            countsale,
            purchases,
            countpurchases
        })
    } catch (error) {
        console.log(error)
    }
}

const createIncomeExpense = async (req, res) => {
    const { initial_date, finish_date } = req.body

    if (!initial_date || !finish_date ) {
        const error = new Error('La fecha de inicio y fin son obligatorios')
        return res.status(401).json({
            msg: error.message
        })
    }

    const format_initial = converttoMMDDYYYY(initial_date)
    const format_finish = converttoMMDDYYYY(finish_date)

    try {
        let bodyIncomes = req.body.detail_incomes
        if (bodyIncomes) {
            bodyIncomes = Promise.all(bodyIncomes.map(async (income) => {
                let newIncomeDetail = new DetailIncome(income)
                newIncomeDetail = await newIncomeDetail.save()
                return newIncomeDetail._id
            }))
        }

        const idsIncomes = await bodyIncomes

        let bodyExpenses = req.body.detail_expenses
        if (bodyExpenses) {
            bodyExpenses = Promise.all(bodyExpenses.map(async (expense) => {
                let newExpenseDetail = new DetailExpense(expense)
                newExpenseDetail = await newExpenseDetail.save()
                return newExpenseDetail._id
            }))
        }

        const idsExpenses = await bodyExpenses

        let priceIncomes = []
        let priceExpenses = []
        let totalPriceIncomes = 0
        let totalPriceExpenses = 0

        if (idsIncomes) {
            priceIncomes = await Promise.all(idsIncomes.map(async (idIncome) => {
                const sale = await DetailIncome.findById(idIncome).populate('sale')
                const subtotal = parseFloat(sale.sale.total.toString())
                return subtotal
            }))

            totalPriceIncomes = priceIncomes.reduce((a, b) => a + b, 0)
        }

        if (idsExpenses) {
            priceExpenses = await Promise.all(idsExpenses.map(async (idExpense) => {
                const purchase = await DetailExpense.findById(idExpense).populate('purchase')
                const subtotal = parseFloat(purchase.purchase.total.toString())
                return subtotal
            }))

            totalPriceExpenses = priceExpenses.reduce((a, b) => a + b, 0)
        }

        const preIncExp = req.body
        preIncExp.initial_date = format_initial
        preIncExp.finish_date = format_finish
        preIncExp.detail_incomes = idsIncomes
        preIncExp.detail_expenses = idsExpenses
        preIncExp.total_income = totalPriceIncomes
        preIncExp.total_expense = totalPriceExpenses

        const newInconceExpense = new IncomeExpense(preIncExp)
        await newInconceExpense.save()

        res.json({
            msg: 'Registro gruardado exitosamente'
        })
    } catch (error) {
        console.log(error)
    }
}

export {
    getAllIncomeExpenses,
    getById,
    getDataByRangeDate,
    getDataByRangeDate2,
    createIncomeExpense
}