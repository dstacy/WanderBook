
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';

import postRoutes from './routes/posts.js';
import userRouter from './routes/user.js';
import campRoutes from './routes/campgrounds.js';
import listRoutes from './routes/lists.js'

import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(express.json({ limit: '30mb', extended: true }))
app.use(express.urlencoded({ limit: '30mb', extended: true }))
app.use(cors());

app.options('*', cors());

app.use((req, res, next) => {
  next(); // Call the next middleware in the chain
});

app.use('/posts', postRoutes);
app.use('/user', userRouter);
app.use('/campgrounds', campRoutes);
app.use('/lists', listRoutes);

// Note to self: move creds to environmental before deployment
const CONNECTION_URL = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5000;

mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`Server Running on Port: http://localhost:${PORT}`)));