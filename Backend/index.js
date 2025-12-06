import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose  from 'mongoose';
dotenv.config({ quiet: true });

const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// server connection
app.listen(process.env.PORT || 4001,()=>{
   console.log(`Server is running on ${process.env.PORT}`);
})

//mongodb connection
mongoose.connect(process.env.MONGODB_URL)
    .then(()=>{
      console.log("Mongodb Connected")
    })
    .catch((err => console.log("Error In Mongodb Connection",err)))

// routes import