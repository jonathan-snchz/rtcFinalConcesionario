require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/connectDB');
const carsRouter = require('./src/api/routes/cars');
const clientsRouter = require('./src/api/routes/clients');
const salesRouter = require('./src/api/routes/sales');
const usersRouter = require('./src/api/routes/users');

const app = express();
const PORT = 3000;

connectDB();

const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_secret: process.env.CLOUDINARY_API_SECRET, 
    api_key: process.env.CLOUDINARY_API_KEY
})

app.use(cors());
app.use(express.json());


app.use('/api/v1/cars', carsRouter);
app.use('/api/v1/clients', clientsRouter);
app.use('/api/v1/sales', salesRouter);
app.use('/api/v1/users', usersRouter);


app.use((req, res) => {
    res.status(404).send({
        message: "Route not found",
        path: req.originalUrl
    });
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: 'Error de servidor' });
});

app.listen(PORT, () => {
    console.log(`Base de datos corriendo en ${PORT}`);
});