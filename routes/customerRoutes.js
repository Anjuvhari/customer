import express from "express"
import { registerCustomer, viewCustomers, getCustomerById, listCities } from "../controllers/customerControllers.js";

const customerRoutes = express.Router()

customerRoutes.post('/',registerCustomer)
customerRoutes.get('/',viewCustomers)
customerRoutes.get('/:id',getCustomerById)
customerRoutes.get('/city',listCities)

export default customerRoutes
