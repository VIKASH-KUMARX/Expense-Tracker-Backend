const mongoose = require('mongoose')

const schema = mongoose.Schema({
    userId : mongoose.Schema.Types.ObjectId,
    name : String
})

const Model = mongoose.model('category',schema);
module.exports = Model;