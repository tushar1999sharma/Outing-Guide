const express           = require("express"),
    router              = express.Router(),
    middleware          = require("../middleware"), //only if file name is index.js
    spotController      = require("../controller/controller_touristSpot"), //controller
    multer              = require('multer'),
    cloudinary          = require('cloudinary'),
    basicConfig         = require("../config/basicConfig");

//Cloudinary conguration
cloudinary.config({ 
    cloud_name: basicConfig.cloud_name, 
    api_key: basicConfig.api_key, 
    api_secret: basicConfig.api_secret 
});

// Creating a multer storage, by not specifying a 'destination' property, we are telling multer to store files
let storage = multer.diskStorage({
    filename: (req, file, callback) => {
        callback(null, Date.now() + file.originalname); //create new name
    }
});

// This function is for filtering the files that are being upload to only be the specified types of 'images'
let imageFilter = (req, file, cb) => {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

// Instantiating a multer instance, and passing our helper functions above to configure it properly
let upload = multer({ storage: storage, fileFilter: imageFilter});

//get all tourist spots from db
router.get("/", spotController.index);

//Form for new tourist spot
router.get("/new", middleware.isLoggedIn, spotController.newSpotPage);

//add new tourist spot to db
router.post("/", middleware.isLoggedIn, upload.single('image'), spotController.newSpot);

//show description
router.get("/:id", spotController.show);

//Edit tourist spot
router.get("/:id/edit", middleware.checkSpotOwnership, spotController.updateSpotPage);

//update data
router.put("/:id", middleware.checkSpotOwnership, upload.single('image'), spotController.updateSpot);

//Delete Tourist Spot
router.delete("/:id", middleware.checkSpotOwnership, spotController.deleteSpot);


module.exports = router;