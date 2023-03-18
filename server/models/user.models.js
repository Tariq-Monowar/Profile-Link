const mongoose = require('mongoose')
const validator = require('validator');


const details = new mongoose.Schema({
    title: {
      type: String,
      required: true
    },
    desc: {
      type: String,
      required: true
    }
});


const itemSchema = new mongoose.Schema({
    details: [details],
    image: {
      data: Buffer,
      contentType: String,
    },
    createdOn:{
        type: Date,
        default: Date.now()
    },
});


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
    },
    items: [itemSchema]
})

module.exports = mongoose.model("User", userSchma)