const express               = require("express"),
    app                     = express(),
    bodyParser              = require("body-parser"), //Parse incoming request bodies
    mongoose                = require("mongoose"), //Object modelling tool for MongoDB
    methodOverride          = require("method-override"), //support PUT or DELETE
    passport                = require("passport"), //Passport is authentication middleware
    LocalStrategy           = require("passport-local"), //local strategy for authenticating with a username and password
    passportLocalMongoose   = require("passport-local-mongoose"), //Mongoose plugin for Passport.
    flash                   = require("connect-flash"), //implement flash 
    moment                  = require('moment'), //display dates and times in diffrent formats
    TouristSpot             = require("./models/model_touristSpot"), //Tourist Spot schema
    Review                  = require("./models/model_review"), //Review Schema
    Comment                 = require("./models/model_comment"), //Comment schema
    User                    = require("./models/model_user"); //User Schema

//REQUIRING ROUTES    
const commentRoutes         = require("./routes/route_comment"),
    touristSpotRoutes       = require("./routes/route_touristSpot"),
    indexRoutes             = require("./routes/route_landing"),
    reviewRoutes            = require("./routes/route_review"),
    authRoutes              = require("./routes/route_authentication"),
    userRoutes              = require("./routes/route_user");

//connect with database
mongoose.connect('mongodb://localhost:27017/outingGuide', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true});

//app.use() loads a function to be used as middleware
app.use(express.static("public")); //express.static() takes a path and returns a middleware that use all files in that path
app.use(bodyParser.urlencoded({extended: true})); //use body parser
app.use(methodOverride("_method")); //use method override
app.use(flash()); //use flash
app.set("view engine","ejs"); //set view enginw

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Tushar Sharma is the best",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); //passport authenticate middleware
//serialize and deserialize model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.locals.moment = moment; //use moment js   
//creating local variables
app.use(async (req, res, next) => {
    res.locals.currentUser = req.user; //current user details
    res.locals.error = req.flash("error"); //error message
    res.locals.success = req.flash("success"); //success message
    if(req.user) { //notification detail of current user
        try {
            let user = await User.findById(req.user._id).populate('notifications', null, { isRead: false }).exec(); //populate if isRead is false
            res.locals.userNotifications = user.notifications.reverse(); //notifications & reverse to get in descending order
        } catch(err) {
            console.log(err.message);
        }
    }
    next(); //to move to next middleware
});

//Routes
app.use("/", indexRoutes);
app.use("/spots/", touristSpotRoutes);
app.use("/spots/", commentRoutes);
app.use("/spots/:id/", reviewRoutes);
app.use(authRoutes);
app.use("/user/", userRoutes);

//Listen 
app.listen(3000, function(){
    console.log("Outing Guide server has started!");
});