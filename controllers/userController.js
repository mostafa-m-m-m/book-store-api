const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const {User ,validateUpdateUser} = require('../models/User');

/** 
* @desc    Update User
* @route   /api/users/:id
* @method   PUT
* @access  Private
**/

const  updateUser = asyncHandler(async (req, res) => {

    const { error } = validateUpdateUser(req.body);
    if(error){
        return res.status(400).json({message: error.details[0].message});
    }

    
    if(req.body.password){
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    const updateUser = await User.findByIdAndUpdate(req.params.id, {
        $set:{
            email: req.body.email,
            username: req.body.username,
            password: req.body.password ,
            isAdmin: req.body.isAdmin
        }
    },{new: true}).select('-password');
    res.status(200).json(updateUser);
})

/** 
* @desc    get all  User
* @route   /api/users
* @method   Get
* @access  Private (only admin)
**/

const getAllUser = asyncHandler(async (req, res) => {

    const users = await User.find().select('-password');
    res.status(200).json(users);

})

/** 
* @desc    get User by id
* @route   /api/users/:id
* @method   Get
* @access  Private (only admin & user himself)
**/

const getUserById = asyncHandler(async (req, res) => {

    const user = await User.findById(req.params.id).select('-password');
    res.status(200).json(user);
    if(user){
        res.status(200).json(user);
    }else{
        res.status(404).json({message: "User not found"});
    }

})

/** 
* @desc    Delete all  User by id
* @route   /api/users/:id
* @method   DELETE
* @access  Private (only admin & user himself)
**/

 const deleteUser = asyncHandler(async (req, res) => {
 
     const user = await User.findById(req.params.id).select('-password');
     if(user){
         await User.findByIdAndDelete(req.params.id);
         res.status(200).json({message: "User has been deleted"  });
     }else{
         res.status(404).json({message: "User not found"});
     }
 
 })

 module.exports = {
     updateUser,
     getAllUser,
     getUserById,
     deleteUser
 }