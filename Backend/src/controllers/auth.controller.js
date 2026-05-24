const  userModel = require('../models/user.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const tokenBlacklistModel = require('../models/blacklist.model')


async function registerUserController(req , res){

    const {username,email,password} = req.body

    if(!username || !email || !password){
        console.warn("[Auth Register] 400 Bad Request: Missing fields:", { username, email, password: !!password });
        return res.status(400).json({
            message:"Please provide username , email , password"
        })
    }

    const isUserAlredyExists = await userModel.findOne({
        $or: [ { username } , { email } ]
    })

    if(isUserAlredyExists){
        console.warn("[Auth Register] 400 Bad Request: User already exists:", { username, email });
        return res.status(400).json({
            message:"Account already exists with this eamil address or username"
        })
    }

    const hash = await bcrypt.hash(password,10)

    const user = await userModel.create({
        username,
        email,
        password:hash
    })

    const token = jwt.sign(
        {id: user._id , username: user.username},
        process.env.JWT_SECRET,
        {expiresIn:"1d"}
    )

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    })

    res.status(201).json({
        message:'User registered sucessfully',
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })
}

async function loginUserController(req,res){
    const {email , username,password} = req.body
    const user = await userModel.findOne({email})

    if(!user){
        console.warn("[Auth Login] 400 Bad Request: User not found for email:", email);
        return res.status(400).json({
            message:"Invalid Email or Password"
        })
    }

    const isPasswordValid = await bcrypt.compare(password,user.password)

    if(!isPasswordValid){
         console.warn("[Auth Login] 400 Bad Request: Invalid password for email:", email);
         return res.status(400).json({
            message:"Invalid Email or Password"
        })
    }

      const token = jwt.sign(
        {id: user._id , username: user.username},
        process.env.JWT_SECRET,
        {expiresIn:"1d"}
    )

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    })
    res.status(200).json({
        message:"User LoggedIn sucessfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })

}

async function logoutUserController(req,res){
    const token = req.cookies.token
    if(token){
        await tokenBlacklistModel.create({token})
    }

    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    })
    res.status(200).json({
        message:"user Logged out sucessfully"
    })
}

async function getUserController(req,res){
    const user = await userModel.findById(req.user.id)

    res.status(200).json({
        message:"user details fetched sucessfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })
}


module.exports ={
    registerUserController,
    loginUserController,
    logoutUserController,
    getUserController
}