// Express Framwork
const express = require('express');
const app = express();

// Environtment
const dotenv = require('dotenv');
dotenv.config();

// Router
const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');

// MongoDB
const mongoose = require('mongoose');
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      //useCreateIndex: true, (not supported)
      useNewUrlParser: true,
      useUnifiedTopology: true,
      //useFindAndModify: false, (not supported)
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};
connectDB();

// Express JSON
app.use(express.json());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/posts', postRouter);

// Port for server.
const port = process.env.PORT || 5050;
app.listen(port, console.log(`Server started on port ${port}`));
