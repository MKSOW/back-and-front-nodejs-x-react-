const mongoose = require('mongoose');


const productSchema = new mongoose.Schema ({
    title: { type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
}, { Timestamp:true }) ;

module.exports = mongoose.model('Product',productSchema);