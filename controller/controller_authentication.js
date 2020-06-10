const passport          = require("passport"),
    User                = require("../models/model_user"), //user schema
    cloudinary          = require('cloudinary'); //upload images to the cloud

module.exports = {
    registerPage: (req,res) => {
        res.render("../views/authentication/view_register.ejs"/* , {title: "Register"} */);
    },

    register: async (req,res) => {
        try{
            let result = await cloudinary.v2.uploader.upload(req.file.path); //upload profile image to cloudinary
            //create new user with given input
            let newUser = new User({ 
                email: req.body.email,
                username: req.body.username,
                name: req.body.name,
                avatar: result.secure_url,
                avatarId: result.public_id,
                description: req.body.description
            });
            //register user
            User.register(newUser, req.body.password, (err,user) => {
                if(err){
                    req.flash("error", err.message); 
                }
                else{
                    passport.authenticate("local")(req, res, () => {
                        //console.log(newUser);
                        req.flash("success", "Welcome to Outing Guide " + user.username);
                        res.redirect("/spots");
                    })
                }
            });
        }
        catch (err) {
            req.flash("error", "Can't upload image, try again later.");
            res.redirect("back");
        }
    },

    logInPage: (req,res) => {
        res.render("../views/authentication/view_logIn.ejs"/* , {title: "LogIn"} */);
    }
}