const {Book} = require("./models/Book")
const {Author} = require("./models/Author")
const {books ,authors}  = require("./data");
const connectToDB = require("./config/db");

require("dotenv").config();


// Connection to DB
connectToDB();


//import Books (seeding database)
const importBooks = async ()=>{
    try {
        await Book.insertMany(books);
        console.log("Books imported successfully");
    } catch (error) {
        console.error("Error importing books", error);
        process.exit(1);
    }
}

//Remove Books
const removeBooks = async ()=>{
    try {
        await Book.deleteMany();
        console.log("Books removed!");
    } catch (error) {
        console.error("Error importing books", error);
        process.exit(1);
    }
}


const importAuthors = async ()=>{
 try{
    await Author.insertMany(authors);
    console.log("Authors imported successfully");

 }catch(error){
     console.error("Error importing authors", error);
     process.exit(1);
 }
}

const removeAuthors = async ()=>{
    try {
        await Author.deleteMany();
        console.log("Authors removed!");
    } catch (error) {
        console.error("Error importing authors", error);
        process.exit(1);
    }
}


if(process.argv[2] === "-importauthors"){
    importAuthors();
}else if(process.argv[2] === "-removeauthors"){
    removeAuthors();
}

if(process.argv[2] === "-import"){
    importBooks();
}else if(process.argv[2] === "-remove"){
    removeBooks();
}