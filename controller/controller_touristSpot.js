const TouristSpot       = require("../models/model_touristSpot"), //camGround schema
    User                = require("../models/model_user"), //user schema
    Notification        = require("../models/model_notification"), //Notification Schema
    cloudinary          = require('cloudinary');

module.exports = {
    index: async (req,res) => {
        if(req.query.search){
            //get all tourist spot from db with given search
            const regex = new RegExp(escapeRegex(req.query.search), 'gi'); //create regex
            try {
                let allSpot = TouristSpot.find({$or: [{name: regex}, {city: regex}]}); //find with regex
                if(allspot.length == 0){
                    req.flash("error", "OOPS!! no result found");
                    res.redirect("/spots");
                }
                else{
                    res.render("../views/touristspot/view_index.ejs",/*  {title: "Outing Guide"}, */ {spots: allSpot});
                }
            } 
            catch (err) {
                req.flash("error", err.message);
                console.log(err);
            }
        }
        else{
            //get all tourist spot from db
            try {
                let allSpot = await TouristSpot.find().sort({rating: 'desc'});
                res.render("../views/touristspot/view_index.ejs",{spots: allSpot, currUser: req.user}/* , {title: "Outing Guide"} */);
            }
            catch(err) {
                req.flash("error", err.message);
                console.log(err);
            }
        }
    },

    newSpotPage: async (req,res) => { 
        res.render("../views/touristspot/view_new.ejs"/* , {title: "Add new Spot"} */);
    },

    newSpot: async (req,res) => {
        try {
            let result = await cloudinary.v2.uploader.upload(req.file.path); //upload image
            let newSpotImage = result.secure_url;
            let newSpotImageId = result.public_id;
            let newSpotName = req.body.name; 
            let newSpotCity = req.body.city;
            let newSpotDescription = req.body.description;
            let author = {
                id: req.user._id,
                username: req.user.username
            }
            //create new tourist spot
            let newSpot = {name: newSpotName, image: newSpotImage, imageId: newSpotImageId, city: newSpotCity, description: newSpotDescription, author: author}
            //create new tourist spot and save it to db
            let spot = await TouristSpot.create(newSpot);
            //redirect to index page
            let user = await User.findById(req.user._id).populate('follower').exec(); //populate expands follower
            let newNotification = {
                username: req.user.username,
                spotId: spot.id,
                avatar: req.user.avatar
            }
            for(let follower of user.follower) {
                let notification = await Notification.create(newNotification); //create notification for every follower   
                follower.notifications.push(notification); //push notificatiom into every follower
                await follower.save();
            }
            req.flash("success", "Successfully created tourist spot");
            res.redirect("/spots");
        }
        catch (err) {
            req.flash("error", "Can't upload image, try again later.");
            req.redirect("back");
        }
    },

    show: async (req,res) => {
        //find tourist spot with provided id
        try{
            let foundSpot = await TouristSpot.findById(req.params.id).populate("comments").exec();
            if(!foundSpot){
                req.flash("error", "Tourist spot not found");
                res.redirect("/spots");
            }
            try {
                //get all tourist spot from db
                let allSpot = await TouristSpot.find();
                res.render("../views/touristspot/view_show.ejs", /* {title: foundSpot.name}, */ {allSpot: allSpot, spot: foundSpot});
            }
            catch (err) {
                req.flash("error", err.message);
            }
        }
        catch (err) {
            req.flash("error", "Tourist Spot Not found");
            res.redirect("/spots");
        }
    },

    updateSpotPage: async (req,res) => {
        //find tourist spot with provided id
        try {
            let foundSpot = await TouristSpot.findById(req.params.id);
            res.render("../views/touristspot/view_edit.ejs", /* {title: "Edit Spot"}, */ {spot: foundSpot});
        }
        catch (err) {
            req.flash("error", "Tourist Spot Not found");
            res.redirect("/spots");
        }
    },

    updateSpot: async (req,res) => {
        try { 
            let spot = await TouristSpot.findById(req.params.id);
            if(req.file){
                try {
                    await cloudinary.v2.uploader.destroy(spot.imageId); //delete image from cloud
                    let result = await cloudinary.v2.uploader.upload(req.file.path); //upload new image
                    spot.imageId = result.public_id;
                    spot.image = result.secure_url;
                } 
                catch (err) {
                    req.flash("error", err.message);
                    return res.redirect("back");
                }
            }
            spot.name = req.body.name;
            spot.description = req.body.description;
            spot.save();
            req.flash("success", "Successfully edited the Tourist Spot");
            res.redirect("/spots/" + req.params.id);
        }
        catch (err) {
            req.flash("error", err.message);
            res.redirect("/spots");
            console.log(err);
        }
    },

    deleteSpot: async (req, res) => {
        try{
            await TouristSpot.findByIdAndRemove(req.params.id);
            req.flash("success", "Successfull deleted the Tourist Spot");
            res.redirect("/spots");  
        }
        catch(err){
            req.flash("error", err.message);
            res.redirect("back");
            console.log(err);
        }
    }
}

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};