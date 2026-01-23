const User = require("../models/users");
const { generateSign } = require("../../utils/jwt");
const bcrypt = require("bcrypt")

async function registerUser(req, res, next) {
  try {
    const user = req.body;
    const userExist = await User.findOne({ email: user.email })
    if (userExist) {
        return res.status(400).json("Error registrando al usuario, el correo ya tiene una cuenta asociada");
    }
    
    const newUser = new User({
        name: user.name,
        email: user.email,
        password: user.password,
    })
    
    const userSaved = await newUser.save()
    return res.status(201).json(userSaved)
  } catch (error) {
        return res.status(400).json("Error registrando al usuario ", error.message);
  }
}
async function logInUser(req, res, next) {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email})
        if (!user) {
            return res.status(400).json("Contraseña o usuario incorrectos")
        }
        if (bcrypt.compareSync(password, user.password)) {
            const token = generateSign(user._id)
            return res.status(200).json({token, user})
        } else{
            res.status(400).json("Contraseña o usuario incorrectos")
        }
    } catch (error) {
        return res.status(400).json("Error en el login ", error.message)
    }
}

async function findUser(req, res, next) {
    try{
        const {id} = req.params;
        const user = await  User.findById(id).select("-password")
        if (!user) {
            return res.status(404).json("Usuario no encontrado");
        }
        return res.status(200).json(user)
    } catch (error){
        return res.status(400).json("Error buscando al usuario ", error.message)   
    }
}
async function getUsers(req, res, next) {
      try {
        const users = await User.find().select("-password")
        return res.status(200).json(users);
    } catch (error) {
        return res.status(400).json("Error al recuperar los usuarios ", error.message);
    }
}
async function deleteUser(req, res, next) {
    try {
        const {id} = req.params;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json("Usuario no encontrado");
        }

        const userDeleted = await User.findByIdAndDelete(id);
        
        return res.status(200).json(`Se ha eliminado el usuario: ${userDeleted}`)        
    } catch (error) {
        return res.status(400).json("Error eliminando el usuario ", error.message);
    }
}
async function updateUser(req, res, next) {
    try{
        const {id} = req.params;
        const userUpdates = req.body;
        const {password, ...allowedUpdates} = userUpdates;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json("Usuario no encontrado");
        }

        const updatedUser = await User.findByIdAndUpdate(id, allowedUpdates, {new: true});

        return res.status(200).json(updatedUser);
    } catch(error){
        return res.status(400).json("Error actualizando la información del usuario ", error.message);
    }
}
async function updatePassword(req, res, next){
    try{
        const {id} = req.params;
        const {oldPassword, newPassword} = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json("Usuario no encontrado");
        }
        if(!bcrypt.compareSync(oldPassword, user.password)){
            return res.status(400).json('La contraseña es incorrecta');
        }
        
        user.password = newPassword;
        const updatedUser = await user.save();

        return res.status(201).json(updatedUser)
    } catch(error){
        return res.status(400).json("Error actualizando la contraseña del usuario ", error.message);
    }
}
module.exports = { 
    registerUser, 
    logInUser, 
    findUser,
    getUsers,
    deleteUser,
    updateUser,
    updatePassword
}