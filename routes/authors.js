const express = require('express');
const router = express.Router();

const {verifyTokenAndAdmin} = require('../middlewares/verifyToken');

const {
        getAuthors,
    getAuthorsById,
    craeteANewAuthor,
    updateAuthour,
    deleteAuthor
} = require('../controllers/authorsController');



router.get('/',getAuthors);

router.get('/:id',getAuthorsById);

router.post('/', verifyTokenAndAdmin , craeteANewAuthor)

router.put("/:id", verifyTokenAndAdmin ,updateAuthour)

router.delete("/:id", verifyTokenAndAdmin ,deleteAuthor)



module.exports = router;