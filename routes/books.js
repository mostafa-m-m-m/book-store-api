const express = require('express');

const router = express.Router();

const { verifyTokenAndAdmin } = require('../middlewares/verifyToken');

const  { getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook} = require('../controllers/booksController');




router.get('/', getAllBooks);


router.get('/:id', getBookById);


router.post('/',verifyTokenAndAdmin,createBook);


router.put("/:id",verifyTokenAndAdmin , updateBook);



router.delete("/:id",verifyTokenAndAdmin,deleteBook);

module.exports = router;