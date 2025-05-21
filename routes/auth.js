const express = require('express');
const router = express.Router();

const {Login,Register} = require('../controllers/authController');


 // api/auth/register 
router.post('/register',Register );



// api/auth/login 
router.post('/login',Login);


module.exports = router;