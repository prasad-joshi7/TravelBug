const Review = require("../models/reviews.js");
const Listing = require("../models/listings.js");


//  reviews -> {post review route}
module.exports.createReview = async (req, res) => {
    console.log(req.params.id);
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("new review added");
    req.flash('success', 'new review added!');
    res.redirect(`/listings/${listing._id}`);
}

// delete Review route
module.exports.destroyReview = async (req, res) => {
    let { id,reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);

    req.flash('success', 'review deleted!');
    res.redirect(`/listings/${id}`);
}