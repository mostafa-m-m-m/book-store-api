const express = require('express');

const router = express.Router();

const {getForgotPassword} = require("../controllers/passwordController")

router.get("/forgot-password",getForgotPassword)

module.exports = router;