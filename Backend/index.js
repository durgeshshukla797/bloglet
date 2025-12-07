import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose  from 'mongoose';
dotenv.config({ quiet: true });
import userRouter from './routes/user.route.js'
import blogRouter from './routes/blog.route.js'
import commentRouter from './routes/comment.route.js'
import likeRouter from './routes/like.route.js'
import dislikeRouter from './routes/dislike.route.js'
import reactionRouter from './routes/reaction.route.js'

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
app.use("/api/users", userRouter)
app.use("/api/blogs", blogRouter)
app.use("/api", commentRouter)
app.use("/api", likeRouter)
app.use("/api", dislikeRouter)
app.use("/api", reactionRouter)

