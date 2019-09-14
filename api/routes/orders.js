const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')
const Order = require('../models/orders');
const Product = require('../models/product');
const OrdersController = require('../controllers/orders');

router.get('/', OrdersController.orders_get_all)

router.post('/', OrdersController.orders_create_order)

router.get('/:id', (req, res, next) => {
    res.status(200).json({
        message:'order details',
        id: req.params.id
    })
})

router.delete('/:id', (req, res, next) => {
    res.status(200).json({
        message:'order deleted',
        id: req.params.id
    })
})

module.exports = router;