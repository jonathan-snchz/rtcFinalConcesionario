const Sale = require('../models/sales');
const Car = require('../models/cars');
const Client = require('../models/clients');

const getSales = async (req, res, next) => {
    try {
        const sales = await Sale.find()
            .populate('car')
            .populate('client');
        return res.status(200).json(sales);
    } catch (error) {
        return res.status(400).json("Error recuperando las ventas");
    }
}

const getSaleById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const sale = await Sale.findOne({ id: id })
            .populate('car')
            .populate('client');
        
        if (!sale) {
            return res.status(404).json("Venta no encontrada");
        }
        
        return res.status(200).json(sale);
    } catch (error) {
        return res.status(400).json("Error recuperando la venta");
    }
}

const postSale = async (req, res, next) => {
    try {
        const sale = req.body;
        
        const saleExist = await Sale.findOne({ id: sale.id });
        if (saleExist) {
            return res.status(400).json("La venta ya existe");
        }
        
        const car = await Car.findById(sale.car);
        if (!car) {
            return res.status(404).json("Coche no encontrado");
        }
        
        const client = await Client.findById(sale.client);
        if (!client) {
            return res.status(404).json("Cliente no encontrado");
        }
        
        const newSale = new Sale(sale);
        const saleSaved = await newSale.save();
        
        await Car.findByIdAndUpdate(sale.car, { availability: 'vendido' });
        
        return res.status(201).json(saleSaved);
    } catch (error) {
        return res.status(400).json("Error registrando la venta");
    }
}

const updateSale = async (req, res, next) => {
    try {
        const { id } = req.params;
        const saleUpdates = req.body;
        
        const updatedSale = await Sale.findOneAndUpdate(
            { id: id },
            saleUpdates,
            { new: true }
        )
        .populate('car')
        .populate('client');
        
        if (!updatedSale) {
            return res.status(404).json("Venta no encontrada");
        }
        
        return res.status(200).json(updatedSale);
    } catch (error) {
        return res.status(400).json("Error actualizando la venta");
    }
}

const deleteSale = async (req, res, next) => {
    try {
        const { id } = req.params;
        const saleDeleted = await Sale.findOneAndDelete({ id: id });
        
        if (!saleDeleted) {
            return res.status(404).json("Venta no encontrada");
        }
        
        return res.status(200).json(saleDeleted);
    } catch (error) {
        return res.status(400).json("Error eliminando la venta");
    }
}

module.exports = {
    getSales,
    getSaleById,
    postSale,
    updateSale,
    deleteSale
};