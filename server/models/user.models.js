const mongoose = require('mongoose')
const validator = require('validator');


const userSchma = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    address: {
        type: String,
    },
    image: {
        data: Buffer,
        contentType: String, 
    },
    password:{
        type: String,
        required: true
    },
    Cpassword:{
        type: String,
        required: true
    },
    createdOn:{
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model("User", userSchma)

