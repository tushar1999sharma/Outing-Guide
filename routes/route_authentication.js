const express           = require("express"),
    router              = express.Router(),
    passport            = require("passport"),
    authController      = require("../controller/controller_authentication"), //controller
    multer              = require('multer'), //to upload file
    cloudinary          = require('cloudinary'); //upload images to the cloud
    
//Cloudinary conguration
require('dotenv').config(); //require .env file
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

var storage = multer.diskStorage({
    filename: (req, file, callback) => {
        callback(null, Date.now() + file.originalname); //file name
    }
});
  
var imageFilter =  (req, file, cb) => {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) { //allowed file types
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
  
var upload = multer({ storage: storage, fileFilter: imageFilter})

//register page route
router.get("/register", authController.registerPage)

//register route
router.post("/register", upload.single('avatar'), authController.register);

//log in page route
router.get("/login", authController.logInPage);

//logIn route
router.post("/login", passport.authenticate("local", {
    successRedirect: "/spots",
    successFlash: "Successfully Logged in",
    failureRedirect: "/login",
    failureFlash: true
}));

//logOut route
router.get("/logout",(req,res) => {
    req.flash("success", "Successfully Logged Out");
    req.logOut();
    res.redirect("/spots");
});

module.exports = router;