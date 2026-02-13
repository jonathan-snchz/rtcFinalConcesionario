const mongoose = require("mongoose");

const clientSchema = mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
    },
    name: {
        type: String, 
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    preferences: {
        type: String,
        trim: true,
    },
}, {
    timestamps: true
})

module.exports = mongoose.model('Client', clientSchema)