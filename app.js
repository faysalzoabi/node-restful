const express = require('express')
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');

mongoose.connect('mongodb://localhost/items', {useNewUrlParser:true})
const db = mongoose.connection
db.on('error', (error) => console.log(error));
db.once('open', () => console.log('connected to database'))

app.use(morgan('dev')); 
app.use('/uploads',express.static('uploads'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use((req, res , next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers','Origin, X-Requsted-With, Content-Type, Accespt')

    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE')
        return res.status(200).json({})
    }

    next();
})

// routes should handle request
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);

app.use((req, res, next) => {
    const error = new Error('not found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error:{
            message:error.message
        }
    });
})
module.exports = app;