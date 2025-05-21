const express = require('express');
const router = express.Router();
 const  {
     updateUser,
     getAllUser,
     getUserById,
     deleteUser
} = require('../controllers/userController');

const  {verifyTokenAndAuthorization ,verifyTokenAndAdmin} = require('../middlewares/verifyToken');



router.put('/:id', verifyTokenAndAuthorization,updateUser);





router.get('/', verifyTokenAndAdmin, getAllUser);



router.get('/:id', verifyTokenAndAuthorization,getUserById );




router.delete('/:id', verifyTokenAndAuthorization, );

module.exports = router;