const express = require('express')
const router = express.Router();
const Product = require('../models/product');
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }   
})

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({
    storage:storage, 
    limit: {
    fileSize:1024 * 1024 * 5
    },
    fileFilter: fileFilter
});


router.get('/', (req, res, next) => {
    Product.find()
    .select('name price _id productImage')
    .exec()
    .then(docs => {
        const response = {
            count:docs.length,
            products: docs.map(doc => {
                return {
                    name:doc.name,
                    price:doc.price,
                    productImage:doc.productImage,
                    _id:doc._id,
                    request:{
                        type:'GET',
                        url:'http://localhost:3000/products/'+doc._id
                    }
                }
            })
        }
        if(docs.length > 0) {
            res.status(200).json(response);
        } else {
            res.status(404).json({
                message:'No entries found'
            })
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error:err
        })
    }) 
})

router.post('/', checkAuth, upload.single('productImage') ,(req, res, next) => {
   console.log(req.file);
   console.log('body', req.body)
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name:req.body.name,
        price: req.body.price,
        productImage:req.file.path
    })
    product
    .save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            message:'created product successfully',
            createdProduct:{
                name:result.name,
                price:result.price,
                _id:result._id,
                request:{
                    type:'GET',
                        url:'http://localhost:3000/products/'+result._id
                }
            }
        })
    })
    .catch(err => {
        console.log(err)
        res.stats(500).json({
            errorrr:err
        })
    });
    
})

router.get('/:id', (req,res,next) => {
    const id = req.params.id;
    Product.findById(id)
    .exec()
    .then(doc => {
        console.log(doc)
        if(doc){
            res.status(200).json(doc)
        } else {
            res.status(404).json({
                message:'No  valid entry find'
            })
        }
        
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error:err})
    })
    
})

router.patch('/:id',(req, res, next) => {
    const id = req.params.id;
    const updateOps = {};
    for(const ops of req.body) {
        updateOps[ops.propNames] = ops.value;
    }
    Product.update({_id:id}, {$set: {
        name:req.body.newName,
        price:req.body.newPrice
    }})
})

router.delete('/:id',(req, res, next) => {
    const id = req.params.id
   Product.remove({_id:id})
   .exec()
   .then(result => {
       res.status(200).json(result)
   })
   .catch(err => {
       console.log(err);
       res.status(500).json({
           error:err
       });
   });
})

module.exports = router;