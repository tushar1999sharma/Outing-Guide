const express           = require("express"),
    router              = express.Router(),
    middleware          = require("../middleware/index"),
    userController      = require("../controller/controller_user"),
    followController    = require("../controller/controller_followSys"),
    notifyController    = require("../controller/controller_notifySys"),
    multer              = require('multer'),
    cloudinary          = require('cloudinary');
    
//Cloudinary conguration
require('dotenv').config();
cloudinary.config({ //provide cloudinary details
    cloud_name: 'tushar19999sharma', 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

var storage = multer.diskStorage({ 
    filename: (req, file, callback) => {
        callback(null, Date.now() + file.originalname); //form new name
    }
});
  
var imageFilter =  (req, file, cb) => {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) { //check extension of file
        return cb(new Error('Only image files are allowed!'), false); 
    }
    cb(null, true);
};

var upload = multer({ storage: storage, fileFilter: imageFilter})

//show user
router.get("/:id", userController.showUser);

//Edit User
router.get("/:id/edit", middleware.checkUserOwnership, userController.updateUserPage);

//update user
router.put("/:id", middleware.checkUserOwnership, upload.single('avatar'), userController.updateUser);

//Follow User
router.get("/follow/:id", middleware.isLoggedIn, middleware.isValidFollow, followController.follow);

//UnFollow User
router.get("/unfollow/:id", middleware.isLoggedIn, middleware.isValidUnFollow, followController.unfollow);

// view all notifications
router.get('/notification/all', middleware.isLoggedIn, notifyController.show);
  
// handle notification
router.get('/notification/:id', middleware.isLoggedIn, notifyController.newNotify);

module.exports = router;