const mongoose = require('mongoose');
const crypto = require('crypto');
const Product = require('../src/models/Product');
require('dotenv').config();

const CATEGORIES = ['Electronics', 'Clothing', 'Home', 'Books', 'Toys', 'Sports'];

async function seedDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to DB. Clearing old data...");
        
        await Product.deleteMany({});
        
        const BATCH_SIZE = 10000;
        const TOTAL_RECORDS = 200000;

        console.time("Seeding Time");
        
        for (let i = 0; i < TOTAL_RECORDS; i += BATCH_SIZE) {
            const batch = [];
            for (let j = 0; j < BATCH_SIZE; j++) {
                const randomDate = new Date(Date.now() - Math.floor(Math.random() * 10000000000));
                batch.push({
                    product_id: crypto.randomUUID(),
                    name: `Product ${i + j}`,
                    category: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
                    price: parseFloat((Math.random() * 500 + 10).toFixed(2)),
                    created_at: randomDate,
                    updated_at: randomDate
                });
            }
            // Using .collection.insertMany bypasses Mongoose validation for massive speed gains
            await Product.collection.insertMany(batch);
            console.log(`Inserted ${i + BATCH_SIZE} / ${TOTAL_RECORDS}`);
        }
        
        console.timeEnd("Seeding Time");
        console.log("Database seeded successfully!");
    } catch (error) {
        console.error("Seeding failed:", error);
    } finally {
        await mongoose.disconnect();
    }
}

seedDB();