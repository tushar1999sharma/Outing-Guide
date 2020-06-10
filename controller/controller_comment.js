const TouristSpot       = require("../models/model_touristSpot"), //camGround schema
    Comment             = require("../models/model_comment"); //comment schema

module.exports = {
    createCommentPage: async (req,res) => {
        try{
            let spot = await TouristSpot.findById(req.params.id);
            res.render("../views/comments/view_new.ejs"/* , {title: "New Comment"} */, {spot: spot});
        }
        catch(err){
            req.flash("error", "Tourist Spot not found");
            res.redirect("back");
        }
    },

    createComment: async (req, res) => {
        try{
            let spot = await TouristSpot.findById(req.params.id)
            try{
                let comment = await Comment.create(req.body.comment); //create comment
                //add username and id to commment object
                comment.author.id = req.user._id;
                comment.author.username = req.user.username;
                comment.save(); //save comment
                await spot.comments.push(comment); //push into that tourist spot
                await spot.save(); //save spot
                req.flash("success", "Successfully created Comment");
                res.redirect("/spots/" + spot._id);
            }
            catch(err){
                req.flash("error", err.message);
            }
        }
        catch(err){
            req.flash("error", err.message);
        }
    },

    updateCommentPage: async (req,res) => {
        try{
            //find tourist spot   
            let spot = await TouristSpot.findById(req.params.id);
            //find comment with provided id
            try{
                let foundComment = await Comment.findById(req.params.Comment_id);
                if(!foundComment){
                    req.flash("error", "Comment not found");
                    res.redirect("back");
                }
                res.render("../views/comments/view_edit.ejs"/* , {title: "Edit Comment"} */, {comment: foundComment, spotID: req.params.id});
            }
            catch(err){
                req.flash("error", "Comment not found");
                res.redirect("back");
            }
        }
        catch(err){
            req.flash("error", "Toursist Spot not found");
            return res.redirect("back");
        }
    },

    updateComment: async (req,res) => {
        try{
            let comment = await Comment.findByIdAndUpdate(req.params.Comment_id, req.body.comment);
            req.flash("success", "Successfull edited the Comment");
            res.redirect("/spots/" + req.params.id);
        }
        catch(err){
            req.flash("error", err.message);
        }
    },

    deleteComment: async (req,res) => {
        try{
            //find comment and remove
            await Comment.findByIdAndRemove(req.params.Comment_id); //find and delete
            req.flash("success", "Successfull deleted the Comment");
            res.redirect("/spots/"+ req.params.id);
        }
        catch(err){
            req.flash("error", err.message);
        }
    }
}