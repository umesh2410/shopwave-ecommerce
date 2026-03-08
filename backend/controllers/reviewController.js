const db = require('../config/db');

// @desc    Create new review
// @route   POST /api/reviews/:productId
// @access  Private
const createReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const productId = req.params.productId;
        const userId = req.user.id; // from auth middleware

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Please provide a valid rating between 1 and 5' });
        }

        // Check if user has already reviewed the product
        const existingReview = await db.query(
            'SELECT * FROM reviews WHERE user_id = $1 AND product_id = $2',
            [userId, productId]
        );

        if (existingReview.rows.length > 0) {
            return res.status(400).json({ message: 'You have already reviewed this product' });
        }

        // Optional: Ensure user actually purchased the product before reviewing
        /*
        const hasPurchased = await db.query(
            `SELECT oi.id FROM order_items oi 
             JOIN orders o ON oi.order_id = o.id 
             WHERE o.user_id = $1 AND oi.product_id = $2 AND o.order_status = 'delivered'`,
            [userId, productId]
        );
        if (hasPurchased.rows.length === 0) {
            return res.status(403).json({ message: 'You must purchase and receive the product before reviewing it' });
        }
        */

        const result = await db.query(
            'INSERT INTO reviews (user_id, product_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *',
            [userId, productId, rating, comment]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        if (err.constraint === 'reviews_user_id_product_id_key') {
            return res.status(400).json({ message: 'Review already exists' });
        }
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get reviews for a product
// @route   GET /api/reviews/:productId
// @access  Public
const getProductReviews = async (req, res) => {
    try {
        const productId = req.params.productId;

        const result = await db.query(
            `SELECT r.*, u.name as user_name, u.avatar_url 
             FROM reviews r 
             JOIN users u ON r.user_id = u.id 
             WHERE r.product_id = $1 
             ORDER BY r.created_at DESC`,
            [productId]
        );

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createReview,
    getProductReviews
};
