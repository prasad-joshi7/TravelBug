if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}



const express = require('express');
const app = express();
const port = 8080;
const mongoose = require('mongoose');
const path = require("path");
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const expressError = require("./utils/expressError.js");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");





// extract from router folder
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// atlasdb-url
const dbUrl = process.env.ATLASDB_URL;

main().then((res) => {
    console.log("connected to DB");
}).catch(err => console.log(err));
async function main() {
    // await mongoose.connect('mongodb://127.0.0.1:27017/TravelBug');
    await mongoose.connect(dbUrl);

}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, '/public')));


const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret:process.env.SECRET,
    },
    touchAfter: 24*3600,
});

store.on("error",()=>{
    console.log("ERROR IN MONGO SESSION STORE",err);
})

// express session
const sessionOptions = ({
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookies: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
});

// app.get('/', (req, res) => {
//     res.send('Hii Im Root');
// })




app.use(session(sessionOptions));
app.use(flash());

//passport local monggose after use of session
// passport 
app.use(passport.initialize());
app.use(passport.session());

// passport local mongoose npm
// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// middleware for express session
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});


// for router
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/",userRouter);


// for all wrong route 
app.all("*", (req, res, next) => {
    next(new expressError(404, "Page Not Found!!"));
})

// error handler
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something Went Wrong!!" } = err;
    res.status(statusCode).render("error.ejs", { message });
})


app.listen(port, () => {
    console.log(`app listening on port ${port}`);
})




