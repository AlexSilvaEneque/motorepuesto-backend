import express from "express"
import { createIncomeExpense, getAllIncomeExpenses, getById, getDataByRangeDate, getDataByRangeDate2 } from "../controllers/incomeExpenseController.js"

const router = express.Router()

router.get('/', getAllIncomeExpenses)
router.get('/:id', getById)
router.post('/', createIncomeExpense)
router.get('/filter/range', getDataByRangeDate2)

export default router