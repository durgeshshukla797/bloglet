import dotenv from 'dotenv';
dotenv.config({ quiet: true });


import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose  from 'mongoose';

import userRouter from './routes/user.route.js'
import blogRouter from './routes/blog.route.js'
import commentRouter from './routes/comment.route.js'
import likeRouter from './routes/like.route.js'
import dislikeRouter from './routes/dislike.route.js'
import reactionRouter from './routes/reaction.route.js'

const app = express();

// middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL, // frontend URL
  credentials: true               // allow cookies
}));

app.use(express.json());
app.use(cookieParser());

//mongodb connection
mongoose.connect(process.env.MONGODB_URL)
    .then(()=>{
      console.log("Mongodb Connected");
      // Start server only after DB connection
      app.listen(process.env.PORT || 4001, () => {
        console.log(`Server is running on port ${process.env.PORT || 4001}`);
      });
    })
    .catch((err) => {
      console.log("Error In Mongodb Connection", err);
      process.exit(1);
    })

// routes import
app.use("/api/users", userRouter)
app.use("/api/blogs", blogRouter)
app.use("/api", commentRouter)
app.use("/api", likeRouter)
app.use("/api", dislikeRouter)
app.use("/api", reactionRouter)


