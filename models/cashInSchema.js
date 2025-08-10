const mongoose = require('mongoose')

const schema = mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    amount : Number,
    source : String,
    datetime : { type: Date }
});

const Model = mongoose.model('cashin',schema);

module.exports = Model;