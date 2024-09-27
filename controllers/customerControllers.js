import customerModel from "../models/customers.js";
const { Op } = require("sequelize");

const registerCustomer = async (req, res) => {
    const { first_name, last_name, city, company } = req.body;

    if (!first_name || !last_name || !city || !company) {
        return res.status(400).json({ error: "All fields are required." });
    }

    try {
        const existingCity = await customerModel.findOne({
            where: { city }
        });

        if (!existingCity) {
            return res.status(400).json({ error: "City does not exist." });
        }

        const existingCompany = await customerModel.findOne({
            where: { company }
        });

        if (!existingCompany) {
            return res.status(400).json({ error: "Company does not exist." });
        }

        const newCustomer = await customerModel.create({
            first_name,
            last_name,
            city,
            company
        });

        return res.status(201).json(newCustomer);
    } catch (err) {
        console.error("Error in creating customer:", err);
        return res.status(500).json({ error: "Error in creating customer." });
    }
};

const viewCustomers = async ( req, res ) => {
    try {
        const { first_name, last_name, city, page = 1, limit = 10 } = req.query;

        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 10;
        
        const offset = (pageNum - 1) * limitNum;

        const whereConditions = {};
        if (first_name) {
            whereConditions.first_name = { [Op.like]: `%${first_name}%` };
        }
        if (last_name) {
            whereConditions.last_name = { [Op.like]: `%${last_name}%` };
        }
        if (city) {
            whereConditions.city = { [Op.like]: `%${city}%` };
        }

        const customers = await customerModel.findAndCountAll({
            where: whereConditions,
            limit: limitNum,
            offset,
        });
        const totalPages = Math.ceil(customers.count / limitNum);

        return res.status(200).json({
            data: customers.rows,       
            totalItems: customers.count, 
            totalPages,                  
            currentPage: pageNum,      
            itemsPerPage: limitNum       
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Error in fetching customers" });
    }
};

const getCustomerById = async ( req, res ) => {
    try {
        const customer = await customerModel.findByPk(req.params.id);
        if (customer) {
            return res.status(200).json(customer);
        }
        return res.status(404).json({ error: "Customer not found" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Error in fetching customer" });
    }
};

const listCities = async ( req, res ) => {
    try {
        const cities = await customerModel.findAll({
            attributes: ['city', [sequelize.fn('COUNT', sequelize.col('city')), 'customer_count']],
            group: ['city'],
            order: [[sequelize.literal('customer_count'), 'DESC']], 
        });
        return res.status(200).json(cities);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Error in fetching cities" });
    }
};

export {registerCustomer, viewCustomers, getCustomerById, listCities}; 
