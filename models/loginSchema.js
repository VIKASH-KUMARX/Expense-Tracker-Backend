const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    isActivated:{ type:Boolean, default:false },
    activationToken: String
})

const Model = mongoose.model('login',schema);

module.exports = Model;