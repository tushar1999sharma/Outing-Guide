const mongoose = require("mongoose");

let notificationSchema = new mongoose.Schema({
	username: String,
	spotId: String,
    userId: String,
    avatar: String,
    //boolean variable to check if notification is read or not
	isRead: { type: Boolean, default: false }
});

module.exports = mongoose.model("Notification", notificationSchema);