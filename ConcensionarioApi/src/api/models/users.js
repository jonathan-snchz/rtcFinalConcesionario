const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {type: String, trim: true, required: true},
    email:{type: String, trim: true, required: true, unique: true},
    password: {
        type: String, 
        trim: true, 
        required: true,
        minlength: [4, 'La contraseña tiene que tener al menos 4 caracteres']
    },
},{
    timestamps: true,
})

userSchema.pre('save', function (next){
    if (!this.isModified('password')) return next();
    
    try{
        this.password = bcrypt.hashSync(this.password, 10)
    } catch(error){
        throw error;
        
    }
})

const User = mongoose.model('users', userSchema)

module.exports = User