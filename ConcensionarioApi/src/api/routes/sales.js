const express = require('express');
const { getSales, getSaleById, postSale, updateSale, deleteSale } = require('../controllers/sales');
const { logged } = require('../../middlewares/auth');

const salesRouter = require('express').Router();

//logged

salesRouter.get('/', logged, getSales);
salesRouter.get('/:id', logged, getSaleById);
salesRouter.post('/', logged, postSale);
salesRouter.put('/:id', logged, updateSale);
salesRouter.delete('/:id', logged, deleteSale);

module.exports = salesRouter;   