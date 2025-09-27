const express = require("express");
const { signup, login } = require("../controllers/authController");
const { signupValidation, loginValidation } = require("../middlewares/authValidation");

const authRouter = express.Router();

authRouter.post("/login", loginValidation, login);

authRouter.post("/signup", signupValidation, signup);

module.exports = { authRouter };