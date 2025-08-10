const mongoose = require('mongoose')

const schema = mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    item:String,
    category : String,
    quantity:Number,
    price : Number,
    datetime : { type: Date }
});

const Model = mongoose.model('cashout',schema);

module.exports = Model;