const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listings");
const { isLoggedIn, isOwner,validateListing } = require("../middleware.js");

// controller filr access
const listingController = require("../controllers/listings.js")

//  multer npm 
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });


// INDEX ROUTE
router.get("/", wrapAsync(listingController.index));


//  new route
router.get("/new", isLoggedIn, listingController.renderNewForm);


// SHOW ROUTE
router.get("/:id", wrapAsync(listingController.showListing));


// CREATE ROUTE
router.post("/", isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(listingController.createListing));


// EDIT ROUTE   {same as show route}
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

//UPDATE ROUTE
router.put("/:id", isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateListing));

// DELETE ROUTE
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));


module.exports = router;