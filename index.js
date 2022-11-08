import express  from "express";
import morgan from "morgan";
import router from "./route/auth.js";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
const app = express()
dotenv.config()



app.use(morgan("tiny"))
app.use(bodyParser.urlencoded({ extended: true }))
// parse application/json
app.use(bodyParser.json())
app.use("/api/user",router)

app.get('/', (req,res) => {
    res.send('Hello to the / route')
})
async function  start(){
    const db = await mongoose.connect(process.env.MONGO_URI, () => console.log("connected to db"))
}
start()
app.listen(3001, () => console.log("starting "))
