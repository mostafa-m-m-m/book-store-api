const mongoose = require('mongoose');
const Joi = require("joi")

const AuthorSchema = new mongoose.Schema({
      firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 3,
        maxLength: 200
      },
      lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 3,
        maxLength: 200         
      },
      nationality: {
        type: String,
        required: true,
        trim: true,
        minLength: 2,
        maxLength: 100
      },
      image: {
        type: String,
        default: "default-avatar.png",
      }
},{
    timestamps: true
});

// Virtual for author's full name
AuthorSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`;
});

// Method to get author profile
AuthorSchema.methods.getProfile = function() {
    return {
        id: this._id,
        fullName: this.fullName,
        nationality: this.nationality,
        image: this.image
    };
};


const Author = mongoose.model('Author', AuthorSchema);


//validate the data
function validateCreateAuthor(obj){
  const schema = Joi.object({
        firstName: Joi.string().trim().min(3).max(200).required(),
        lastName: Joi.string().trim().min(3).max(200).required(),
        nationality: Joi.string().trim().min(3).max(200).required(),
        image: Joi.string().trim(),
   
  });
  
 return  schema.validate(obj);
}

function validateUpdateAuthor(obj){
  const schema = Joi.object({
        firstName: Joi.string().trim().min(3).max(200),
        lastName: Joi.string().trim().min(3).max(200),
        nationality: Joi.string().trim().min(2).max(100),
        image: Joi.string().trim(),
  });
  
 return  schema.validate(obj);
}


module.exports = {
    Author,
    validateCreateAuthor,
    validateUpdateAuthor
};