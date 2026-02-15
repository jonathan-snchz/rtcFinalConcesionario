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
        const client = await Client.findOne({ id: parseInt(id) });
        
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
        const clientData = req.body;
        
        const emailExist = await Client.findOne({ email: clientData.email });
        if (emailExist) {
            return res.status(400).json("El email ya está registrado");
        }
        
        const lastClient = await Client.findOne().sort({ id: -1 });
        const nextId = lastClient ? lastClient.id + 1 : 1;
        
        const newClient = new Client({
            ...clientData,
            id: nextId
        });
        
        const clientSaved = await newClient.save();
        return res.status(201).json(clientSaved);
    } catch (error) {
        console.error(error);
        return res.status(400).json("Error registrando el cliente");
    }
}

const updateClient = async (req, res, next) => {
    try {
        const { id } = req.params;
        const clientUpdates = req.body;
        
        if (clientUpdates.email) {
            const existingClient = await Client.findOne({ 
                email: clientUpdates.email,
                id: { $ne: parseInt(id) }
            });
            
            if (existingClient) {
                return res.status(400).json("El email ya está registrado por otro cliente");
            }
        }
        
        const updatedClient = await Client.findOneAndUpdate(
            { id: parseInt(id) },
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
        
        const Sale = require('../models/sales');
        const hasSales = await Sale.findOne({ client: id });
        
        if (hasSales) {
            return res.status(400).json("No se puede eliminar el cliente porque tiene ventas asociadas");
        }
        
        const clientDeleted = await Client.findOneAndDelete({ id: parseInt(id) });
        
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