const TouristSpot = require("../models/model_touristSpot");
const Comment = require("../models/model_comment");
const User = require("../models/model_user"); //user Schema

//All middlewrae obj
const middlewareObj = {};

middlewareObj.isLoggedIn = (req,res,next) => {
    if(req.isAuthenticated()){
        return next(); //since authenticated now move on to next function
    }
    req.flash("error", "You need to be logged in first"); //Key - Value pair
    res.redirect("/login");
}

middlewareObj.checkSpotOwnership = (req, res, next) => {
    if(req.isAuthenticated()) {
        TouristSpot.findById(req.params.id, (err, foundspot) => {
            if(err || !foundspot){
                req.flash("error", "Tourist Spot not found");
                res.redirect("/spots");
            } 
            else {
                //does user own Tourist Spot?
                if(foundspot.author.id.equals(req.user._id)){
                    return next();  
                } 
                else{
                    req.flash("error", "You did not have access to that page");
                    res.redirect("back");
                }
            }
        });
    } 
    else{
        req.flash("error", "You need to be logged in first");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = (req, res, next) => {
    if(req.isAuthenticated()) {
        Comment.findById(req.params.Comment_id, (err, foundComment) => {
            if(err || !foundComment) {
                req.flash("error", "Comment not found");
                res.redirect("/spots");
            } else {
                //does user own comment?
                if(foundComment.author.id.equals(req.user._id)) { //compare current user id with comment author id
                 next(); //since authenticated now move on to next function
                } else {
                    req.flash("error", "You did not have access to that page");
                    res.redirect("back");
                }
           }
        });
    } else {
        req.flash("error", "You need to be logged in first");
        res.redirect("back");
    }
}

middlewareObj.checkReviewOwnership = (req, res, next) => {
    if(req.isAuthenticated()){
        Review.findById(req.params.review_id, (err, foundReview) => {
            if(err || !foundReview){
                res.redirect("back");
            }  else {
                // does user own the comment?
                if(foundReview.author.id.equals(req.user._id)) { //compare current user id with review author id
                    next(); //now move on to next function
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};

middlewareObj.checkReviewExistence = (req, res, next) => {
    if (req.isAuthenticated()) {
        TouristSpot.findById(req.params.id).populate("reviews").exec((err, foundSpot) => { //populate review
            if (err || !foundSpot) {
                req.flash("error", "Tourist Spot not found.");
                res.redirect("back");
            } else {
                // check if req.user._id exists in foundspot reviews
                let foundUserReview = foundSpot.reviews.some( (review) => {
                    return review.author.id.equals(req.user._id); //compare current user id with review author id
                });
                if (foundUserReview) {
                    req.flash("error", "You already rate this Blog.");
                    return res.redirect("/spots/" + foundSpot._id);
                }
                // if the review was not found, go to the next middleware
                next();
            }
        });
    } else {
        req.flash("error", "You need to login first.");
        res.redirect("back");
    }
};

middlewareObj.checkUserOwnership = (req, res, next) => {
    if(req.isAuthenticated()) {
        User.findById(req.params.id, (err, foundUser) => {
            if(err || !foundUser){
                req.flash("error", "User not found");
                res.redirect("/spots");
            } else {
                //does user own comment?
                if(foundUser._id.equals(req.user._id)) { //compare current user id with review author id
                    next(); //now move on to next function 
                } else {
                    req.flash("error", "You did not have access to that page");
                    res.redirect("/spots");
                }
           }
        });
    } else {
        req.flash("error", "You need to be logged in first");
        res.redirect("/login");
    }
}

middlewareObj.isValidFollow = async (req, res, next) => {
    if(req.isAuthenticated()){
        //check if user had not already followed that user
        let user = await User.findById(req.user._id);
        for(let i = 0; i < user.following.length; i++){
            if(user.following[i].equals(req.params.id)){ //compare current user id with user following id
                req.flash("error", "You had already followed this user");
                res.redirect("/user/req.params.id");
            }
        }
        next(); //now move on to next function
    }
    else{
        req.flash("error", "You need to log in first");
        res.redirect("/login");
    }
}

middlewareObj.isValidUnFollow = async (req, res, next) => {
    if(req.isAuthenticated()){
        //check if user had not already followed that user
        let user = await User.findById(req.user._id);
        let flag = 0;
        for(let i = 0; i < user.following.length; i++){
            if(user.following[i].equals(req.params.id)){ //compare current user id with user following id
                flag = 1;
                next(); //now move on to next function
            }
        }
        if(flag == 0){
            req.flash("error", "You had not followed this user");
            res.redirect("/user/req.params.id");
        }
    }
    else{
        req.flash("error", "You need to log in first");
        res.redirect("/login");
    } 
}

module.exports = middlewareObj;