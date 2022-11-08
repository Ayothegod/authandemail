import express from 'express'
const router = express.Router()
import User from "../model/User.js"
import bcrypt from 'bcryptjs'
import { registerValidation } from '../validation.js'


router.post("/register", async (req,res) => {
    
    //validate using joi
    const {error} = registerValidation(req.body)
    if(error) return res.send(error.details[0].message)

    //check if user already exist
    const emailExist = await User.findOne({email: req.body.email})
    if(emailExist) return res.status(404).send("Email already exist")

    //hash our password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    //create new user
    const user = new User ({
        name:req.body.name,
        email:req.body.email,
        password:hashedPassword,
    })
    try {
        const savedUser = await user.save()
        res.send(savedUser)
    } catch (error) {
        console.log(error);
        res.send(error)
    }
})

export default router