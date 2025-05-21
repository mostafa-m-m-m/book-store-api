const express = require('express');

const router = express.Router();

const asyncHandler = require('express-async-handler');
const {Book, validateCreateBook, validateUpdateBook} = require('../models/Book');
const { verifyTokenAndAdmin } = require('../middlewares/verifyToken');



/** 
* @desc Get all books
* @method GET
* @route /api/books
* @access Public
**/

router.get('/', asyncHandler(async (req, res) => {
  const books = await Book.find().populate('author');
  res.status(200).json(books);
}));


/** 
* @desc Get book by id
* @method GET
* @route /api/books/:id
* @access Public
**/
router.get('/:id', asyncHandler(async  (req, res) => {

    const book = await Book.findById(req.params.id);
    if(book){
        res.status(200).json(book);
    }else{
        res.status(404).json({message:"Book not found"});
    }
}));


/**
 * @desc create a new book
 * @method POST
 * @route /api/books
 * @access privete (only admin)
 */
router.post('/',verifyTokenAndAdmin, asyncHandler (async (req, res) => {
  
    const {error} = validateCreateBook(req.body);

  if(error){
   return res.status(400).json({message: error.details[0].message});
  }
     
    const book = new Book({
            title: req.body.title,
            author: req.body.author,
            description: req.body.description,
            price: req.body.price,
            cover: req.body.cover
    })
    const result = await book.save();

    res.status(201).json(result);
}));

/**
 * @desc update a  book
 * @method PUT
 * @route /api/books
 * @access private (only admin)
 */

router.put("/:id", verifyTokenAndAdmin , asyncHandler(async(req,res)=>{

const {error} = validateUpdateBook(req.body);

if(error){
    return res.status(400).json({message: error.details[0].message});
  }
  const UpdatedBook = await Book.findByIdAndUpdate(req.params.id,{
    $set: {
      title: req.body.title,
      author: req.body.author,
      description: req.body.description,
      price: req.body.price,
      cover: req.body.cover,
    }
  },{new:true}) ;
 
  res.status(200).json(UpdatedBook);
}));


/**
 * @desc delete a  book
 * @method DELETE
 * @route /api/books
 * @access private (only admin)
 */

router.delete("/:id",verifyTokenAndAdmin,asyncHandler (async(req,res)=>{

const book = await Book.findByIdAndDelete(req.params.id);
 
  if(book){
    await Book.findByIdAndDelete(req.params.id);
    return res.status(200).json({message:"Book has been deleted"});
  }else{
    return res.status(404).json({message:"Book not found"});
  }
}));

module.exports = router;