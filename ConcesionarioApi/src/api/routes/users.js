const { logged, owner } = require('../../middlewares/auth');
const { registerUser, logInUser, findUser, getUsers, updateUser, deleteUser, updatePassword } = require('../controllers/users');

const usersRouter = require('express').Router();

// not logged
usersRouter.post("/login", logInUser);

// logged
usersRouter.get("/:id", logged, findUser)
usersRouter.get("/", logged, getUsers);
usersRouter.post("/register", logged, registerUser);

// owns
usersRouter.put("/:id", logged, owner, updateUser);
usersRouter.put("/:id/password", logged, owner, updatePassword);
usersRouter.delete("/:id", logged, owner, deleteUser);

module.exports = usersRouter;