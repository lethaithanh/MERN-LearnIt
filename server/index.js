// Express Framwork
const express = require('express');
const app = express();

// Environtment
const dotenv = require('dotenv');
dotenv.config();

// MongoDB
const mongoose = require('mongoose');
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      //useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      //useFindAndModify: false,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};
connectDB();

// Routes
app.get('/', (req, res) => res.send('Hello, World !!!'));

// Port for server.
const port = process.env.PORT || 5000;
app.listen(port, console.log(`Server started on port ${port}`));
