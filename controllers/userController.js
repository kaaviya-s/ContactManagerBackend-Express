const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt= require("bcrypt");
const jwt = require('jsonwebtoken');

//public
const registerUser =asyncHandler (async(req,res)=>{
    const {username,email,password} = req.body;
    if(!username || !email || !password){
        res.status(400); //validation failed
        throw new Error("All fields are mandatory")
    }
    const userAvailable = await User.findOne({email});
   
    if(userAvailable){
        res.status(400);
        throw new Error("User already registered!");
    }
    const hashedPasword = await bcrypt.hash(password,10);
    console.log(hashedPasword);

    const user = await User.create({
        username,
        email,
        password : hashedPasword
    })
    console.log(`User craeted ${user}`);
    //Hash password
   if(user){
    res.status(201);
    res.json({_id : user.id , email:user.email});
   }else{
    res.status(400);
    throw new Error("Not a valid user data")
   }
});

//public
const loginUser =asyncHandler (async(req,res)=>{
    const {email,password} = req.body;
    if(!email || !password){
        res.status(400);
        throw new Error("All fields are required!");
    }
    
    const user = await User.findOne({email});
    if(user && await bcrypt.compare(password , user.password)){
        const accesstoken  = jwt.sign({
            user:{
                username: user.username,
                email : user.email,
                id : user.id
            },

        },process.env.ACCESS_TOKEN_SECRET,{expiresIn:"15m"});
        res.status(200);
        res.json({accessToken:accesstoken});
    }else{
        res.status(401);
        throw new Error("Email or password is not valid")
    }
    res.json({message: "user logged"})
});

//private method
//only the logged in user can see this
const currentUser =asyncHandler (async(req,res)=>{
    res.status(200);
    res.json(req.user);
});
module.exports = {registerUser,loginUser,currentUser};
