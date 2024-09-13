const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviews.js");

// create schema
const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    
  },
  price: Number,
  location: String,
  country: String,

  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review',
    }
  ],

  owner:{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }
});


// delete listing with all its correpondence review
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({_id: { $in: listing.reviews } });
  }
})


// create model
const Listing = mongoose.model("Listing", listingSchema);

// export model
module.exports = Listing;