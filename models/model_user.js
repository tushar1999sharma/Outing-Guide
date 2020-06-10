const mongoose              = require("mongoose"),
    passportLocalMongoose   = require("passport-local-mongoose"); 

let userSchema = new mongoose.Schema({
    email:{
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    
    password: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,

    avatar: String,
    avatarId: String,
    
    description: {
        type: String,
        default: "Hey i am new to outing guide"
    },

    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    follower: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],

    notifications: [
    	{
    	   type: mongoose.Schema.Types.ObjectId,
    	   ref: 'Notification'
    	}
    ],
    
    isAdmin: {
        type: Boolean,
        default: false
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",userSchema);