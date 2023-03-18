const route = require('express').Router()
const fs = require("fs");
const multer = require("multer");
const session = require('express-session');
const {
   getAlluser,
   getOneUser, 
   createUser, 
   deleteUser, 
   updateUser,
   loginUser,
   userProfile,
   postItem
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
  secret: 'my-secret-key', // Set a secret key for the session
  resave: false,
  saveUninitialized: true
}));


// route.get('/old-route', (req, res) => {
//   const data = {
//     userName: "Seam",
//     id: "435"
//   };
//   req.session.data = data;
//   res.redirect('/api/new-route');
// });


// route.get('/new-route', (req, res) => {
//   const data = req.session.data;
//   req.session.data = null;
//   res.status(200).json(data);
// });

route.get('/profile',userProfile)
route.post('/login',loginUser)
route.post('/items',postItem)
route.route('/').get(getAlluser).post(upload.single("image"),createUser)
route.route('/:id').get(getOneUser).patch(upload.single("image"),updateUser).delete(deleteUser)




module.exports = route