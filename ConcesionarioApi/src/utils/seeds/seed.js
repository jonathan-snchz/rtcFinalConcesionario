require('dotenv').config()
const fs = require('fs');
const csv = require('csv-parser')
const bcrypt = require('bcrypt')
const Car = require('../../api/models/cars')
const Client = require('../../api/models/clients')
const Sale = require('../../api/models/sales')
const User = require('../../api/models/users')
const mongoose = require('mongoose');

// Limpiar datos de vehículos del CSV
const cleanCar = (row) => {
    return {
        vin: row['Número de identificación del vehículo (VIN)'].trim(),
        brand: row['Marca'].toLowerCase().trim(),
        model: row['Modelo'].trim(),
        type: row['Tipo de vehículo'].toLowerCase().trim(),
        year: parseInt(row['Año de fabricación']),
        condition: row['Estado'].toLowerCase(),
        km: parseInt(row['Kilometraje'].replace(' km', '').replace(/\./g, '')),
        price: parseInt(row['Precio de venta'].replace('$', '').replace(/\./g, '')),
        buyedWhen: new Date(row['Fecha de adquisición']),
        availability: row['Estado del vehículo'].toLowerCase().trim(),
        img: row['Imagen'].trim(),
        color: row['Color'].trim()  
    }
}

const cleanClient = (row) => {
    return {
        id: parseInt(row['ID cliente']),
        name: row['Nombre del cliente'].trim(),
        email: row['Email'].trim(),
        preferences: row['Preferencias del cliente'].trim()
    };
}

// Leer el csv
const readCSV = (file) => {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(file).pipe(csv()).on('data', (data) => results.push(data)).on('end', () => resolve(results)).on('error', (error) => reject(error))
    });
};

mongoose
    .connect(process.env.DB_URL)
    .then(async () => {
        console.log("Conectado a la base de datos");        
        
        // Buscamos todos los datos
        const allCars = await Car.find();
        const allClients = await Client.find();
        const allSales = await Sale.find();
        const allUsers = await User.find();
        
        console.log("Datos encontrados");
        
        // Comprobamos si había y borramos
        if (allCars.length) {
            console.log("Borrando vehículos...");
            await Car.collection.drop();          
        }
        
        if (allClients.length) {
            console.log("Borrando clientes...");
            await Client.collection.drop();
        }
        
        if (allSales.length) {
            console.log("Borrando ventas...");
            await Sale.collection.drop();
        }

        if (allUsers.length) {
            console.log("Borrando usuarios...");
            await User.collection.drop();
        }
    })
    .catch((err) => console.log(`Error borrando datos: ${err}`))
    .then(async () => {

        // Poblamos con los datos de los CSV
        
        // Crear usuarios de prueba, hasheamos manualmente
        console.log("Creando usuarios de prueba...");
        const users = [
            {
                name: 'Manuel Garcia',
                email: 'manuel@concesionario.com',
                password: bcrypt.hashSync('manuel123', 10),
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Jose Rodriguez',
                email: 'jose@concesionario.com',
                password: bcrypt.hashSync('jose123', 10), 
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Maria Lopez',
                email: 'maria@concesionario.com',
                password: bcrypt.hashSync('maria123', 10), 
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];
        await User.insertMany(users);
        console.log("Usuarios creados (contraseñas hasheadas)");

        // Leer e insertar vehículos
        console.log("Leyendo Vehiculos.csv...");
        const carsData = await readCSV('./src/utils/seeds/data/Vehiculos.csv');
        const cleanedCars = carsData.map(cleanCar);
        
        const insertedCars = await Car.insertMany(cleanedCars);
        console.log("Vehículos insertados");

        // Mapear los vehículos con el vin
        const carsMap = {};
        insertedCars.forEach(car => {
            carsMap[car.vin] = car;
        });

        // Leer e insertar clientes
        console.log("Leyendo Clientes.csv...");
        const clientsData = await readCSV('./src/utils/seeds/data/Clientes.csv');
        const cleanedClients = clientsData.map(cleanClient);
        
        const insertedClients = await Client.insertMany(cleanedClients);
        console.log("Clientes insertados");

        // Mapear los usuarios con la id
        const clientsMap = {};
        insertedClients.forEach(client => {
            clientsMap[client.id] = client;
        });

        // Leer e insertar ventas
        console.log("Leyendo Ventas.csv...");
        const salesData = await readCSV('./src/utils/seeds/data/Ventas.csv');
        
        const cleanedSales = salesData.map(row => {
            const carVin = row['Vehículo vendido']?.trim() || '';
            const clientId = parseInt(row['Cliente asociado']) || 0;
            
            const car = carsMap[carVin];
            const client = clientsMap[clientId];
            
            return {
                id: parseInt(row['ID venta']) || 0,
                car: car._id,
                client: client._id,
                date: row['Fecha de venta'] ? new Date(row['Fecha de venta']) : new Date(),
                payment: row['Método de pago']?.toLowerCase().trim() || '',
                delivery: row['Fecha de entrega'] ? new Date(row['Fecha de entrega']) : new Date()
            };
        });
        
        await Sale.insertMany(cleanedSales);
        console.log("Ventas insertadas");

        console.log("Base de datos poblada exitosamente!");
    })
    .catch((error) => console.log(`Error poblando datos: ${error}`))
    .finally(() => {
        console.log("Desconectando, adiós!");
        mongoose.disconnect();
    });