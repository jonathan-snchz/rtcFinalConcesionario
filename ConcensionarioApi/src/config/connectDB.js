const mongoose = require('mongoose');

async function connectDB() {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log('Conectado a la base de datos');
    } catch (error) {
        console.log('Error conectando a la base de datos', error);
    }
}

module.exports = connectDB;