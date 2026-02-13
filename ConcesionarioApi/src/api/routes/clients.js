const express = require('express');
const { getClients, getClientById, postClient, updateClient, deleteClient } = require('../controllers/clients');
const { logged } = require('../../middlewares/auth');

const clientsRouter = require('express').Router();


// logged

clientsRouter.get('/', logged, getClients);
clientsRouter.get('/:id', logged, getClientById);
clientsRouter.post('/', logged, postClient);
clientsRouter.put('/:id', logged, updateClient);
clientsRouter.delete('/:id', logged, deleteClient);

module.exports = clientsRouter;