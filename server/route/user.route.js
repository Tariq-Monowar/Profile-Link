const route = require('express').Router()
const fs = require("fs");
const multer = require("multer");
const session = require('express-session');
const {
   getAlluser, 
   createUser, 
   deleteUser, 
   updateUser,
   loginUser,
   userProfile,
  } = require('../controller/user.controllers')

  
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads");
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });


route.use(session({
  secret: 'my-secret-key', 
  resave: false,
  saveUninitialized: true
}));


route.get('/profile',userProfile)
route.post('/login',loginUser)

route.route('/')
     .get(getAlluser)
     .post(upload.single("image"),createUser)

route.route('/:id')
     .patch(upload.single("image"),updateUser)
     .delete(deleteUser)


module.exports = route

