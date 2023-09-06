import express from 'express'
import { allClient, deleteClient, getById, newClient, update } from '../controllers/clientController.js'

const router = express.Router()

router.route('/')
    .get(allClient)
    .post(newClient)

router.route('/:id')
    .get(getById)
    .put(update)
    .patch(deleteClient)

export default router