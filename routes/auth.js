const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler')
const { User, validateRegisterUser, validateLoginUser } = require('../models/User');
const bcrypt = require('bcrypt');



/**
 * @desc Register New User
 * @route /api/auth/register 
 * @method POST
 *  @access Public
 */
router.post('/register', asyncHandler(async (req, res) => { 

    // validate the request body
   const { error } = validateRegisterUser(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    const { email } = req.body;
    let user = await User.findOne({ email });
    if (user) {
        return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);

    user = new User({
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
    });
    const result = await user.save();
    const token = user.generateToken();

    const { password, ...others } = result._doc;
    res.status(201).json({...others, token});
}));



/**
 * @desc login New User
 * @route /api/auth/login 
 * @method POST
 *  @access Public
 */
router.post('/login', asyncHandler(async (req, res) => { 
    // validate the request body
    const { error } = validateLoginUser(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ message: "invalid email or password" });

    // Debug: log hashed password
    const validPassword = await bcrypt.compare(req.body.password, user.password);

    if (!validPassword) return res.status(400).json({ message: "invalid password or email" });

    const token = user.generateToken();
    const { password, ...others } = user._doc;

    res.status(200).json({...others, token});
}));


module.exports = router;