const Car = require('../models/cars');
const { deleteApiImg } = require('../../utils/deleteApiImg');

async function getCars(req, res, next) {
  try {
    const cars = await Car.find();
    return res.status(200).json(cars);
  } catch (error) {
    return res.status(400).json("Error al recuperar los coches: " + error.message);
  }
}

async function getCarByVin(req, res, next) {
  try {
    const { vin } = req.params;
    const car = await Car.findOne({ vin });
    
    if (!car) {
      return res.status(404).json("Coche no encontrado");
    }
    
    return res.status(200).json(car);
  } catch (error) {
    return res.status(400).json("Error buscando el coche: " + error.message);
  }
}

async function postCar(req, res, next) {
  try {
    const carData = req.body;
    

    if (req.file) {
      carData.img = req.file.path;
    }
    

    const existingCar = await Car.findOne({ vin: carData.vin });
    if (existingCar) {

      if (req.file && req.file.path) {
        try {
          await deleteApiImg(req.file.path);
        } catch (deleteError) {
          console.error('Error borrando la imagen:', deleteError);
        }
      }
      return res.status(400).json("El VIN ya existe en la base de datos");
    }
    
    const newCar = new Car(carData);
    const carSaved = await newCar.save();
    
    return res.status(201).json(carSaved);
  } catch (error) {

    if (req.file && req.file.path) {
      try {
        await deleteApiImg(req.file.path);
      } catch (deleteError) {
        console.error('Error borrando la imagen:', deleteError);
      }
    }
    
    return res.status(400).json("Error creando el coche: " + error.message);
  }
}

async function updateCar(req, res, next) {
  try {
    const { vin } = req.params;
    const updates = req.body;
    
    const existingCar = await Car.findOne({ vin });
    if (!existingCar) {

      if (req.file && req.file.path) {
        try {
          await deleteApiImg(req.file.path);
        } catch (deleteError) {
          console.error('Error borrando la imagen:', deleteError);
        }
      }
      return res.status(404).json("Coche no encontrado");
    }
    
    if (req.file) {

      if (existingCar.img) {
        try {
          await deleteApiImg(existingCar.img);
        } catch (deleteError) {
          console.error('Error borrando la imagen:', deleteError);
        }
      }

      updates.img = req.file.path;
    } else if (updates.img === '' || updates.img === null) {

      if (existingCar.img) {
        try {
          await deleteApiImg(existingCar.img);
        } catch (deleteError) {
          console.error('Error borrando la imagen:', deleteError);
        }
      }
      updates.img = null;
    }
    
    const updatedCar = await Car.findOneAndUpdate(
      { vin },
      updates,
      { new: true, runValidators: true }
    );
    
    return res.status(200).json(updatedCar);
  } catch (error) {

    if (req.file && req.file.path) {
      try {
        await deleteApiImg(req.file.path);
      } catch (deleteError) {
        console.error('Error borrando la imagen:', deleteError);
      }
    }
    
    return res.status(400).json("Error actualizando el coche: " + error.message);
  }
}

async function deleteCar(req, res, next) {
  try {
    const { vin } = req.params;
    const car = await Car.findOne({ vin });
    
    if (!car) {
      return res.status(404).json("Coche no encontrado");
    }
    
    if (car.img) {
      try {
        await deleteApiImg(car.img);
      } catch (deleteError) {
        console.error('Error borrando la imagen:', deleteError);
        // Continue with car deletion even if image deletion fails
      }
    }
    
    await Car.findOneAndDelete({ vin });
    
    return res.status(200).json(`Coche eliminado: ${vin}`);
  } catch (error) {
    return res.status(400).json("Error eliminando el coche: " + error.message);
  }
}

module.exports = { getCars, getCarByVin, postCar, updateCar, deleteCar };