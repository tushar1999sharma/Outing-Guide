const TouristSpot       = require("../models/model_touristSpot"), //camGround schema
    User                = require("../models/model_user"), //user Schema
    cloudinary          = require('cloudinary');

module.exports = {
    showUser: async (req, res) => {
        try {
            let foundUser = await User.findById(req.params.id);
            try {
                let foundSpot = await TouristSpot.find().where('author.id').equals(foundUser._id).exec();
                res.render("../views/user/view_user.ejs", {user: foundUser, spot: foundSpot});
            } 
            catch (err) {
                req.flash("error", err.message);
                res.redirect("/spots");
            }
        } 
        catch (err) {
            req.flash("error", "User not found");
            res.redirect("/spots");
        }
    },

    updateUserPage:  async (req,res) => {
        //find User with provided id
        try {
            let foundUser = await User.findById(req.params.id);
            res.render("../views/user/view_authEdit.ejs", {user: foundUser});
        } 
        catch (err) {
            req.flash("error", "User not found");
            res.redirect("back");
        } 
    },

    updateUser: async (req,res) => {
        try{
            let user = await User.findById(req.params.id);
            if(req.file){
                try{
                    //update user avatar
                    await cloudinary.v2.uploader.destroy(user.avatarId); //delete prev image image from cloudinary
                    let result = await cloudinary.v2.uploader.upload(req.file.path); //upload new image to cloudinary
                    user.avatarId = result.public_id;
                    user.avatar = result.secure_url;
                } 
                catch(err){
                    req.flash("error", err.message);
                    return res.redirect("back");
                }
            }
            //update user other details
            user.name = req.body.name;
            user.email = req.body.email;
            user.description = req.body.description;
            if(req.body.newpassword){
                let npass = req.body.newpassword;
                let cpass = req.body.confirmpassword;
                if(npass == cpass){ //check if pass is same in both input
                    await user.setPassword(npass);
                }
                else{
                    req.flash("error", "Password did not match");
                    return res.redirect("back");
                }
            }
            user.save();
            req.flash("success", "Successfully edited the User Profile");
            res.redirect("back");
        }
        catch (err) {
            req.flash("error", err.message);
            return res.redirect("back");
        }
    }
}