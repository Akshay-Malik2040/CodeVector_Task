const express=require('express');
const connectDB=require('./config/db')
const app=express();
require('dotenv').config();

const PORT=process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is listening at ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });