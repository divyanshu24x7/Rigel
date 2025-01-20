import express from "express"
import bcrypt from "bcrypt"
import User from "../models/User.js"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
const router = express.Router()
dotenv.config()

router.post("/SignUp", async (req, res) => {
    try {
        const username = req.body.username
        const password = req.body.password
        let user = await User.findOne({username})
        if (user) {
            return res.status(401).json({ message: "user already exists" })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        user = new User({ username: username, password: hashedPassword })
        await user.save()
        res.status(201).json({ message: "user added successfully" })
    } catch (err) {
        console.error(err.message);
        res.status(500).send('could not add new user');
    }

})

router.post("/login",async (req,res)=>{
    const { username, password } = req.body;
    try{
        const user = await User.findOne({username})
        if(!user){
            return res.status(400).json({message:"user does not exist"})
        }

        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(400).json({message:"incorrect password"})
        }

        const accessToken = jwt.sign({userId: user._id},process.env.ACCESS_TOKEN_SECRET,{expiresIn: "1h"})
        console.log(accessToken)
        res.status(200).json({message:"login succesful",accessToken,userId:user._id})
    }catch(err){
        console.log(err)
        res.status(500).json({message:"error during login"})
    }
})


export default router