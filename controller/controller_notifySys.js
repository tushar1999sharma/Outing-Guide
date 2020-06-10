const User          = require("../models/model_user"), //user Schema
    Notification    = require("../models/model_notification"); //Notification Schema

module.exports = {
    show: async (req, res) => {
        try {
            let user = await User.findById(req.user._id).populate({
                path: 'notifications', //ppopulate notifications
                options: { sort: { "_id": -1 } } //sort in descending order
            }).exec();
            let allNotifications = user.notifications;
            res.render("../views/user/view_notifications.ejs", {allNotifications:  allNotifications});
        } 
        catch(err) {
            req.flash('error', err.message);
            res.redirect('back');
        }
    },

    newNotify: async (req, res) => {
        try {
            let notification = await Notification.findById(req.params.id); //find notification by ID
            notification.isRead = true; //change isREad to true
            await notification.save(); //save changes
            if(notification.spotId){
                res.redirect("/spots/" + notification.spotId);
            }
            else{
                res.redirect("/user/" + notification.userId);
            }
        } 
        catch(err) {
            req.flash('error', err.message);
            res.redirect('back');
        }
    }
}