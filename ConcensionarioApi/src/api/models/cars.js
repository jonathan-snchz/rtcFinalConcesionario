const mongoose = require("mongoose");

const carsSchema = mongoose.Schema({
    vin: {
        type: String, 
        required: true,
        unique: true,
        trim: true,
    },
    brand: {
        type: String,
        enum: [
            "acura", "audi", "bmw", "cadillac", "chevrolet", "dodge", "fiat", "ford", "gmc", "honda", "hyundai", "jeep", "lincoln", "mazda", "mercedes", "nissan", "ram", "tesla", "toyota", "volvo" 
        ], 
        required: true,
        trim: true,
        
    },
    model: {
        type: String,
        trim: true,

    },
    type: {
        type: String,
        enum: ["turismo", "furgoneta"], 
        required: true,
        trim: true,
    },
    year: {
        type: Number, 
        required: true,
    },
    condition: {
        type: String,
        enum: ["usado", "nuevo"], 
        required: true
    },
    km: {
        type: Number, 
        required: true,
    },
    price: {
        type: Number, 
        required: true,
    },
    buyedWhen: {
        type: Date, 
        required: true,
    },
    availability: {
        type: String,
        enum: ["disponible", "vendido", "reservado"], 
        required: true,
    },
    img: {
        type: String,
        trim: true,

    },
    color: {
        type:String,
        trim: true,
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Car', carsSchema)