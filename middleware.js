const Listing = require("./models/listings");
const Review = require("./models/reviews.js");
const expressError = require("./utils/expressError.js");
const { listingSchema } = require("./schema.js");
const { reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {

    if (!req.isAuthenticated()) {

        //redirectUrl save
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in to create listing");
        return res.redirect("/login");
    }
    next();
};


// locals method (passport does not delet this)
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

//  isOwner or not 
module.exports.isOwner = async (req,res,next)=>{
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","you are not owner of this listing!");
       return res.redirect(`/listings/${id}`);
    }

    next();
};

//joi for listing 
module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new expressError(400, errMsg);
    }
    else {
        next();
    }
}


// for review joi
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);

    if (error) {
        const errMsg = error.details.map((el) => el.message).join(",");
        throw new expressError(400, errMsg);
    }
    else {
        next();
    }
}

//  isReviewAuthor or not 
module.exports.isReviewAuthor = async (req,res,next)=>{
    let { id , reviewId } = req.params;
    let listing = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","you are not author of this review!");
       return res.redirect(`/listings/${id}`);
    }

    next();
};