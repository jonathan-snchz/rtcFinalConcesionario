
const { getCars, getCarByVin, postCar, updateCar, deleteCar } = require('../controllers/cars');
const { logged } = require('../../middlewares/auth');
const upload = require('../../middlewares/imgUpload');

const carsRouter = require('express').Router();

// not logged
carsRouter.get('/', getCars);

// logged
carsRouter.get('/:vin', logged, getCarByVin);
carsRouter.post('/', logged, upload.single('image'), postCar);
carsRouter.put('/:vin', logged, upload.single('image'), updateCar);
carsRouter.delete('/:vin', logged, deleteCar);

module.exports = carsRouter;