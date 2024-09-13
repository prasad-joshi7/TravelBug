const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");


//controller file access
const userController = require("../controllers/users.js"); 
const user = require("../models/user.js");



// render sign up 
router.get("/signup", userController.renderSignupForm);

// signup
router.post("/signup", wrapAsync(userController.signup));

// render loginform
router.get("/login", userController.rendreLoginForm);

//  login
router.post('/login', saveRedirectUrl,
    passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
    userController.login );


// logout
router.get("/logout", userController.logout);


module.exports = router;