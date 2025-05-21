const mongoose = require('mongoose');


async function connectToDB() {

        try{
          await   mongoose.connect(process.env.MONGO_URI);
            console.log('Connected to MongoDB...');
        } catch(err) {
            console.log("Connection Failed To MongoDB",err)
        }
    }


    module.exports = connectToDB;