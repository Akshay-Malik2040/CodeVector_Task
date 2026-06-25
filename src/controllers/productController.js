const Product = require('../models/Product');

async function getProducts(req, res) {
    try {
        const { category, cursor_date, cursor_id, limit = 20 } = req.query;
        const parsedLimit = parseInt(limit, 10);

        let query = {};

        // 1. Apply category filter if provided
        if (category) {
            query.category = category;
        }

        // 2. Cursor Pagination Logic (Keyset Pagination)
        if (cursor_date && cursor_id) {
            const dateObj = new Date(cursor_date);
            query.$or = [
                { created_at: { $lt: dateObj } },
                { 
                    created_at: dateObj, 
                    _id: { $lt: cursor_id } // Mongoose casts this string to ObjectId automatically
                }
            ];
        }

        // 3. Execute Query
        const products = await Product.find(query)
            .sort({ created_at: -1, _id: -1 })
            .limit(parsedLimit + 1) // Fetch n+1 to check for a next page
            .lean(); // CRITICAL: Returns plain JS objects instead of heavy Mongoose documents

        // 4. Handle Pagination State
        const hasNextPage = products.length > parsedLimit;
        const results = hasNextPage ? products.slice(0, -1) : products;

        let nextCursorDate = null;
        let nextCursorId = null;

        if (hasNextPage) {
            const lastItem = results[results.length - 1];
            nextCursorDate = lastItem.created_at;
            nextCursorId = lastItem._id;
        }

        // 5. Send Response
        res.json({
            data: results,
            pagination: {
                next_cursor_date: nextCursorDate,
                next_cursor_id: nextCursorId,
                has_next_page: hasNextPage
            }
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = { getProducts };