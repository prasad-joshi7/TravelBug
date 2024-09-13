const User = require("../models/user.js");



//  render signupForm
module.exports.renderSignupForm =  (req, res) => {
    res.render("../views/users/signup.ejs")
};

// signup
module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registerUser = await User.register(newUser, password);
        console.log(registerUser);

        // login after sign up
        req.login(registerUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome To TravelBug");
            res.redirect("/listings");
        });


    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }

}


// rendre loginform 
module.exports.rendreLoginForm =  (req, res) => {
    res.render("../views/users/login.ejs");
};

//  login 
module.exports.login = async (req, res) => {
    req.flash("success", "welcome back to TravelBug");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);

}

// logout
module.exports.logout =  (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next();
        }

        req.flash("success", "You are logout");
        res.redirect("/listings");
    });
};