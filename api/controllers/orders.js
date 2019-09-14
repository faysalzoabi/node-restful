const Order = require('../models/orders');
const Product = require('../models/product');
const mongoose = require('mongoose')

exports.orders_get_all = (req, res, next) => {
    Order
    .find()
    .select('product quantity _id')
    .populate('product', 'name')
    .exec()
    .then(docs => {
        res.status(200).json({
            counts:docs.length,
            orders:docs.map(doc => {
                return{
                    _id:doc._id,
                    product:doc.product,
                    quantity:doc.quantity,
                    request:{
                        type:'GET',
                        url:'http://lcoalhost:3000'
                    }
                }
            }),
        });
    })
    .catch(err => {
        res.status(500).json({
            error:err
        })
    })
}


exports.orders_create_order = (req, res, next) => {
    Product.findById(req.body.productId)
            .then(product => {
                if(!product) {
                    return res.status(404).json({
                        message:'Product not found'
                    })
                }
                const order = new Order({
                    _id:mongoose.Types.ObjectId(),
                    qunatity:req.body.quantity,
                    product:req.body.productId
                })
                return order.save()
            })
            .then(result => {
                res.status(201).json(result)
            })
            .catch(err => {
                res.status(500).json({
                    message:'Product not found',
                    error:err
                })
            })
        }