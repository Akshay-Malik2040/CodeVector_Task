const express=require('express');
const connectDB=require('./config/db')
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');
require('dotenv').config();

const app=express();
const PORT=process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'API is running' });
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is listening at ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });