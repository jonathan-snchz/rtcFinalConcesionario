const Client = require('../models/clients');

const getClients = async (req, res, next) => {
    try {
        const clients = await Client.find();
        return res.status(200).json(clients);
    } catch (error) {
        return res.status(400).json("Error recuperando los clientes");
    }
}

const getClientById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const client = await Client.findOne({ id: id });
        
        if (!client) {
            return res.status(404).json("Cliente no encontrado");
        }
        
        return res.status(200).json(client);
    } catch (error) {
        return res.status(400).json("Error recuperando el cliente");
    }
}

const postClient = async (req, res, next) => {
    try {
        const client = req.body;
        
        const clientExist = await Client.findOne({ 
            $or: [
                { id: client.id },
                { email: client.email }
            ]
        });
        
        if (clientExist) {
            return res.status(400).json("El cliente ya existe");
        }
        
        const newClient = new Client(client);
        const clientSaved = await newClient.save();
        return res.status(201).json(clientSaved);
    } catch (error) {
        return res.status(400).json("Error registrando el cliente");
    }
}

const updateClient = async (req, res, next) => {
    try {
        const { id } = req.params;
        const clientUpdates = req.body;
        
        const updatedClient = await Client.findOneAndUpdate(
            { id: id },
            clientUpdates,
            { new: true }
        );
        
        if (!updatedClient) {
            return res.status(404).json("Cliente no encontrado");
        }
        
        return res.status(200).json(updatedClient);
    } catch (error) {
        return res.status(400).json("Error actualizando el cliente");
    }
}

const deleteClient = async (req, res, next) => {
    try {
        const { id } = req.params;
        const clientDeleted = await Client.findOneAndDelete({ id: id });
        
        if (!clientDeleted) {
            return res.status(404).json("Cliente no encontrado");
        }
        
        return res.status(200).json(clientDeleted);
    } catch (error) {
        return res.status(400).json("Error eliminando el cliente");
    }
}

module.exports = {
    getClients,
    getClientById,
    postClient,
    updateClient,
    deleteClient
};