const mongoose = require('mongoose');

const saleSchema = mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    car: { 
        type: mongoose.Types.ObjectId, 
        ref: 'Car',
        required: true 
    },
    client: { 
        type: mongoose.Types.ObjectId, 
        ref: 'Client',
        required: true 
    },
    date: {
        type: Date,
        required: true
    },
    payment: {
        type: String,
        enum: [
            "transacción bancaria", "efectivo", "financiación"
        ],
        required: true
    },
    delivery: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Sale', saleSchema);