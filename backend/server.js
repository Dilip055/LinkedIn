import express from 'express';
import dotenv from "dotenv";
import cors from "cors";
import mongoose from 'mongoose';
import postsRoute from "./routes/post.route.js";
import userRoute from "./routes/user.route.js";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();




const app = express();
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(postsRoute);
app.use(userRoute)

const start = async()=>{
    const connectdb = await mongoose.connect("mongodb+srv://dilipsuthar055:dilipsuthar055@apnaproconnect.i1fdv.mongodb.net/?appName=apnaproconnect")
}
const port = 5000

app.listen(port,()=>{
    console.log(`server is running port ${port}`)
})

start().then(()=>{
    console.log("DataBase Connected")
}).catch((error)=>{
    console.log(error)
})