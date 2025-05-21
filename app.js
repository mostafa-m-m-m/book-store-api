const express = require('express');
const morgan = require('morgan'); 
const logger = require('./middlewares/logger');
const { notFound, errorHandler } = require('./middlewares/errors');
require('dotenv').config();
const connectToDB = require('./config/db');
// Connection to database
connectToDB();


//init app 
const app = express();

//apply middlewares
app.use(express.json()); 
app.use(morgan('dev')); 

app.use(logger);

app.set('views engine', 'ejs');




// Routes 
app.use('/api/books', require('./routes/books'));
app.use('/api/authors', require('./routes/authors'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/password', require('./routes/password'));

// error handling middleware

app.use(notFound) 
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
// running the server
app.listen(PORT,() => console.log(`Server is running in ${process.env.NODE_ENV} port ${PORT}`));