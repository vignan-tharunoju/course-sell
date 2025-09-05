const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const app = express(); 
app.use(express.json());
const PORT = process.env.PORT;
const MONGODB_URL = process.env.MONGODB_URL;


const userRoutes = require('../course-selling-app/routes/user');
const adminRoutes = require('../course-selling-app/routes/admin');
const courseRoutes = require('../course-selling-app/routes/course')

app.use('/api/user', userRoutes) ;
app.use('/api/admin', adminRoutes) ;
app.use('/api/course', courseRoutes) ;

async function main() {
  try {
    await mongoose.connect(MONGODB_URL);
    app.listen(PORT);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
  }
}

app.use((err, req, res, next) => {
    console.error(err.message);
    res.status(500).json({ message: "Internal server error" });
});

main()
