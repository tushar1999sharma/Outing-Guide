const User          = require("../models/model_user"), //user Schema
    Notification    = require("../models/model_notification"); //Notification Schema

module.exports = {
    follow: async (req, res) => {
        try {
            if(req.user._id == req.params.id){
                req.flash("error", "You can't follow yourself");
                res.redirect("/user/<%= req.params.id %>");
            }
            let user1 = await User.findById(req.user._id);
            let user2 = await User.findById(req.params.id);
            //user1 follow user2
            user1.following.push(req.params.id);
            user2.follower.push(req.user._id);
            //save changes
            await user1.save();
            await user2.save();
            let newNotification = {
                username: req.user.username,
                userId: user1._id,
                avatar: req.user.avatar
            }
            let notification = await Notification.create(newNotification); //create notification
            await user2.notifications.push(notification); //push notification to user2
            user2.save();
            req.flash("success", "You have just successfully followed " + user2.username);
            res.redirect("back");
        } 
        catch (err) {
            req.flash("error", err.message);
            res.redirect("/user/<%= req.params.id %>");
        }
    },

    unfollow: async (req, res) => {
        try {
            if(req.user._id == req.params.id){
                req.flash("error", "You can't unfollow yourself");
                res.redirect("/user/<%= req.params.id %>");
            }
            //find both user
            let user1 = await User.findById(req.user._id); 
            let user2 = await User.findById(req.params.id);
            //user1 unfollow user2
            let index1 = user1.following.indexOf(req.params.id); //make changes in following list of user1
            let index2 = user2.follower.indexOf(req.user._id); //make changes in follower list of user2
            if (index1 > -1){
                user1.following.splice(index1, 1);
            }
            if (index2 > -1){
                user2.follower.splice(index2, 1);
            }
            //save changes
            user1.save();
            user2.save();
            req.flash("success", "You have just successfully unfollowed " + user2.username);
            res.redirect("back");
        } catch (err) {
            req.flash("error", err.message);
            res.redirect("/user/<%= req.params.id %>");
        }
    }
}