require('dotenv').config();
const User = require('../models/user.models');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const fs = require("fs");

/**
 * GET: http://localhost:1000/api/users
 **/
const getAlluser = async (req,res)=>{
    try {
        const allUser = await User.find();
        res.status(200).json(allUser);
    } catch (error) {
        res.status(500).json(error.message);
    }
}

/**
 * GET: http://localhost:1000/api/users/:id
 * Retrieves a user _id  
 * @param {string} req.params.id 
 */
const getOneUser = async (req,res)=>{
    try {
        const oneUser = await User.findById({_id: req.params.id});
        res.status(200).json(oneUser);
    } catch (error) {
        res.status(500).json(error.message);
    }
}


/**
 * POST: http://localhost:1000/api
 * @param : {
 *  "username" : "example123",
 *  "email": "example@gmail.com",
 *  "password" : "admin123",
 *  "Cpassword": "admin123",
 *  "profile": ""
 * }
 **/
const createUser = async (req, res) => {
  try {
    let { userName, email, address, password, Cpassword } = req.body;
 
    if (!userName || !email || !password || !Cpassword) {
      return res.status(400).json({
        message: 'Please fill all fields and attach a file',
      });
    }
    
     // Check if user already exists
    const exuser = await User.findOne({email: email})
      if(exuser){
          return res.status(404).json({
              message: "user is already valid"
      });  
    } 

    // Remove leading and trailing whitespace from userName
    userName = userName.replace(/\s+/g, " ").trim();
  
    // Validate email
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        message: 'Please enter a valid email address',
      });
    }

    if (password !== Cpassword) {
      return res.status(400).json({
        message: 'Password does not match confirm password',
      });
    }

    if (userName === password || email === password) {
      return res.status(400).json({
        message: 'Password cannot be the same as your username or email',
      });
    }

    // Check if username is same as email
    if (userName === email) {
      return res.status(400).json({
        message: 'Username cannot be the same as your email',
      });
    }


    if(password.length < 6){
      return res.status(400).json({
        message: 'Password must be longer than 6 characters',
      });
    }

    
    // const passwordRegex = /[\^$.*+?()!`@|'";:[\]{}|\\]/g;
    // if(password.length <= 6 || !password.match(passwordRegex)){
    //   return res.status(400).json({
    //     message: 'Password must be longer than 6 characters and Add special characters',
    //   });
    // }

    // Hash the password and confirm password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const hashedCPassword = await bcrypt.hash(Cpassword, salt);

    // Create a new user object
    const newUser = new User({
      userName,
      email,
      address,
      password: hashedPassword,
      Cpassword: hashedCPassword,
    });

    if(req.file){
      newUser.image = {
          data: fs.readFileSync('uploads/' + req.file.filename),
          contentType: 'image/png',
      }
    }

    await newUser.save();

    if(req.file){
      fs.unlinkSync('uploads/' + req.file.filename);
    }

    res.status(201).json(newUser);
    
  } catch (error) {
    res.status(500).json(
      { 
        message: error.message 
      }
    );
  }
};


/**
 * PATCH: http://localhost:1000/api/:id
 * @example
 * // Example request body:
 * // {
 * //   "userName" : "example123",
 * //   "password" : "user123",
 * //   "address": "example",
 * //   "image": "req.file"
 * // }
 */
const updateUser = async (req,res)=>{
  const{userName, email, address, password, Cpassword } = req.body

  try {
    const update = await User.findById({_id: req.params.id})

    if(userName){
      // Check if password is same as username or email
      if (userName === email) {
        return res.status(400).json({
          message: 'userName cannot be the same as your email',
        });
      }
      // Remove leading and trailing whitespace from userName
      let replace = userName.replace(/\s+/g, " ").trim();
      update.userName = replace
    }

    if(email){
     update.email = email
    }

    if(address){
     let replace = address.replace(/\s+/g, " ").trim();
     update.address = replace
    }

    if(password){
      if(password.length < 6){
        return res.status(400).json({
          message: 'Password must be longer than 6 characters',
        });
      }
      if (password === email) {
        return res.status(400).json({
          message: 'password cannot be the same as your email',
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
     
      update.password = hashedPassword
      update.Cpassword = hashedPassword
    }

    if (req.file) {
     update.image = {
         data: fs.readFileSync("uploads/" + req.file.filename),
         contentType: "image/png",
     }
     fs.unlinkSync("uploads/" + req.file.filename)
    }

    await update.save()
    res.status(201).json(update)
  } catch (error) {
    res.status(500).send(error.message)
  }
}


/**
 * POST: http://localhost:1000/api/login
 * @param : {
 * "email": "example@gmail.com",
 * "password" : "admin123",
 * }
 **/
const loginUser = async(req,res)=>{
  try {
      const { email, password } = req.body

      if(!email || !password){
          res.status(404).json({
              message: "Missing email or password"
          })
          return;
      }

      const user = await User.findOne({email});
      // Check if user exists
      if (!user) {
          res.status(404).json({
              message: "User not found"
          });
          return;
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
          const token = jwt.sign({ userId: user._id },
                        process.env.SECRET_KEY, 
                        { expiresIn: '10m' });
          res.status(200).json({ token, user });
      } else {
          res.status(401).json({
          message: "Invalid email or password",
          });
      }

  } catch (error) {
      res.status(500).json(error.message)
  }
}



/**
 * GET: http://localhost:1000/api/profile
 * @headers: { 
 *    "Authorization": "Bearer <token>" 
 * }
 **/
const userProfile = (req, res) => {
  const token = req.headers.authorization;

  // Check if token is provided
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, 'my-secret-key');
    const userId = decoded.userId;

    // Find the user with the given id
    User.findById(userId, (err, user) => {
      if (err) {
        res.status(500).json({ message: err.message });
        return;
      }
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      // Send user data
      res.status(200).json(user);
    });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
}


/**
 * POST: http://localhost:1000/api/items
 * @headers: { 
 *    "Authorization": "Bearer <token>" 
 * }
 * @body: {
 *   "image": "<base64-encoded-image>",
 *   "details": [
 *     {"title": "<title-1>", "desc": "<desc-1>"},
 *     {"title": "<title-2>", "desc": "<desc-2>"},
 *     ...
 *   ]
 * }
 **/
const postItem = (req, res) => {
  const token = req.headers.authorization;

  // Check if token is provided
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, 'my-secret-key');
    const userId = decoded.userId;

    // Find the user with the given id
    User.findById(userId, (err, user) => {
      if (err) {
        res.status(500).json({ message: err.message });
        return;
      }
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      // Create a new item
      const newItem = new Item();
      
      // Set the image data and content type
      newItem.image.data = Buffer.from(req.body.image, 'base64');
      newItem.image.contentType = 'image/png'; // or use the actual content type of the image

      // Set the details
      newItem.details = req.body.details;

      // Save the item to the user's items array
      user.items.push(newItem);

      // Save the user to the database
      user.save((err, savedUser) => {
        if (err) {
          res.status(500).json({ message: err.message });
          return;
        }
        res.status(201).json(newItem);
      });
    });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
}



/**
 * DELETE: http://localhost:1000/api/:id
 * @param {string} req.params.id - The ID of the user to be deleted
 **/
const deleteUser = async (req,res)=>{
    try {
        await User.findByIdAndDelete({_id: req.params.id})
        res.status(200).json({
            message: "Successfully Delete"
        });
    } catch (error) {
        res.status(500).json(error.message);
    }
}

module.exports = { getAlluser, getOneUser, createUser, deleteUser, updateUser, loginUser, userProfile, postItem }
