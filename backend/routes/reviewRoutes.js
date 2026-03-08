const express = require('express');
const router = express.Router({ mergeParams: true }); // Important for accessing :productId
const { createReview, getProductReviews } = require('../controllers/reviewController');
const { authenticate } = require('../middleware/auth');

router.route('/:productId')
    .post(authenticate, createReview)
    .get(getProductReviews);

module.exports = router;
