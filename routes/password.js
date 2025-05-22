const express = require('express');

const router = express.Router();

const {getForgotPassword ,sendForgetPasswordLink,restThePassword,getResetPasswordView} = require("../controllers/passwordController")


// /password/forgot-password
router.get("/forgot-password",getForgotPassword)
router.post("/forgot-password",sendForgetPasswordLink)


// /password/reset-password/:userId/:token
router.get("/reset-password/:userId/:token",getResetPasswordView)
router.post("/reset-password/:userId/:token",restThePassword)
module.exports = router;