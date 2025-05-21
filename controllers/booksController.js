
const asyncHandler = require('express-async-handler');
const {Book, validateCreateBook, validateUpdateBook} = require('../models/Book');





/** 
* @desc Get all books
* @method GET
* @route /api/books
* @access Public
**/
const getAllBooks = asyncHandler(async (req, res) => {
  //Comparioson Query Operators
  // $eq: equals
  // $gt: greater than
  // $gte: greater than or equal
  // $lt: less than
  // $lte: less than or equal
  // $ne: not equal
  // $in: is in the array
  // $nin: is not in the array
  // $and: matches all conditions in the array
  // $or: matches at least one condition in the array
  // $not: negates the condition inside the $not array
  // $regex: matches using a regular expression
  // $exists: checks if a field exists
  // $mod: checks if a number is divisible by another number
  // $size: checks if the size of an array matches a certain value
  // $type: checks if a field is of a certain data type
  // $all: checks if an array contains all the elements in a specified array
 const {minPrice,maxPrice} = req.query;
 let books;
 if(minPrice && maxPrice){
      books = await Book.find({price: {$gte: minPrice, $lte: maxPrice}})

       .populate("author",["_id","firstName","lastName"]);

 }else{
      books = await Book.find()
     .populate("author",["_id","firstName","lastName"]);

 }
  res.status(200).json(books);
})

/** 
* @desc Get book by id
* @method GET
* @route /api/books/:id
* @access Public
**/
const getBookById =  asyncHandler(async  (req, res) => {

    const book = await Book.findById(req.params.id);
    if(book){
        res.status(200).json(book);
    }else{
        res.status(404).json({message:"Book not found"});
    }
});

/**
 * @desc create a new book
 * @method POST
 * @route /api/books
 * @access privete (only admin)
 */
const createBook =  asyncHandler (async (req, res) => {
  
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
})
/**
 * @desc update a  book
 * @method PUT
 * @route /api/books
 * @access private (only admin)
 */

const updateBook =  asyncHandler(async(req,res)=>{

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
})

/**
 * @desc delete a  book
 * @method DELETE
 * @route /api/books
 * @access private (only admin)
 */
const deleteBook = asyncHandler (async(req,res)=>{

const book = await Book.findByIdAndDelete(req.params.id);
 
  if(book){
    await Book.findByIdAndDelete(req.params.id);
    return res.status(200).json({message:"Book has been deleted"});
  }else{
    return res.status(404).json({message:"Book not found"});
  }
})
module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
}