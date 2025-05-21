 const asyncHandler = require('express-async-handler')
 const {Author , validateCreateAuthor, validateUpdateAuthor}  = require('../models/Author');

/** 
* @desc Get all authors
* @method GET
* @route /api/authors
* @access Public
**/
const getAuthors = asyncHandler(
    async (req, res) => {
        // Check if pageNumber is provided in the query
        if (req.query.pageNumber) {
            // If pageNumber is provided, use pagination
            const pageNumber = parseInt(req.query.pageNumber);
            const authorsPerPage = 2;
            
            // Ensure pageNumber is positive
            const skip = Math.max(0, (pageNumber - 1) * authorsPerPage);
            
            const authors = await Author.find()
                                        .skip(skip)
                                        .limit(authorsPerPage);
            res.status(200).json(authors);
        } else {
            // If no pageNumber is provided, return all authors
            const authors = await Author.find();
            res.status(200).json(authors);
        }
    }
)


/** 
* @desc Get authors by id
* @method GET
* @route /api/authors/:id
* @access Public
**/

const getAuthorsById = asyncHandler(
    async (req, res) => {
        const author = await Author.findById(req.params.id);
        if (author) {
            res.status(200).json(author);
        } else {
            res.status(404).json({ message: "author not found" });
        }

}
)


/**
 * @desc create a new author
 * @method POST
 * @route /api/authors
 * @access Private (only admin)
 */


const craeteANewAuthor = asyncHandler(
    async (req, res) => {
  
    const {error} = validateCreateAuthor(req.body);

  if(error){
   return res.status(400).json({message: error.details[0].message});
  }
     
    const author = new Author({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            nationality: req.body.nationality,
            image:req.body.image,
    })
    const result = await author.save();

        res.status(201).json(result);

    }
)

/**
 * @desc update a  author
 * @method PUT
 * @route /api/authors/:id
 * @access Private (only admin)
 */
const updateAuthour = asyncHandler(
    async (req,res)=>{

const {error} = validateUpdateAuthor(req.body);

if(error){
    return res.status(400).json({message: error.details[0].message});
  }
       const author = await Author.findByIdAndUpdate(req.params.id,{
        $set:{
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                nationality: req.body.nationality,
                image:req.body.image,
        }
        },{new:true});
        res.status(200).json(author);
    }
)
/**
 * @desc delete a  author
 * @method DELETE
 * @route /api/authors/:id
 * @access Private (only admin)
 */

const deleteAuthor = asyncHandler(
    async (req,res)=>{

          
     const author = await Author.findById(req.params.id)
        if(author){
            await Author.findByIdAndDelete(req.params.id);
            return res.status(200).json({message:"author has been delete"});
        }else{
            return res.status(404).json({message:"author not found"});
        }


}
)

module.exports = {
    getAuthors,
    getAuthorsById,
    craeteANewAuthor,
    updateAuthour,
    deleteAuthor
}