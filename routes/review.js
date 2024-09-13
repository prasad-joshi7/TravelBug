const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const expressError = require("../utils/expressError.js");
const Review = require("../models/reviews.js");
const Listing = require("../models/listings.js");
const { validateReview, isLoggedIn,isReviewAuthor } = require("../middleware");


// controller folder access
const reviewController = require("../controllers/reviews.js");


//  reviews -> {post review route}
router.post("/", isLoggedIn ,validateReview, wrapAsync(reviewController.createReview));

// delete Review route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));


module.exports = router;