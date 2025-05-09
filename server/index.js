import express from 'express';
import dotenv from 'dotenv';
import { connect } from 'mongoose';
import connectDB from './database/db.js';
import userRoute from './routes/user.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import courseRoute from './routes/course.route.js'
import mediaRoute from './routes/media.route.js'
import purchaseRoute from './routes/purchaseCourse.route.js'
import courseProgressRoute from './routes/courseProgress.route.js'


dotenv.config({});
// call database connectionf
connectDB();

const app = express();
app.use(cookieParser());
app.use(cors ({
    origin: "http://localhost:5173",
    credentials: true,
}))


const PORT = process.env.PORT || 3000 ;

// adding a default middleare 
app.use(express.json());


// apis - Middleware to get data from backend
app.use("/api/v1/media", mediaRoute)
app.use("/api/v1/user", userRoute)
app.use("/api/v1/course", courseRoute)
app.use("/api/v1/purchase", purchaseRoute) 
app.use("/api/v1/progress", courseProgressRoute);



app.get("/home", (_, res)=>{
    res.status(200).json({
        success : true,
        message : "Hello I am coming from Backend"
    })
})

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})