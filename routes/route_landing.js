var express         = require("express"),
    router          = express.Router();


router.get("/",(req,res) => {
    res.render("../views/partials/landing.ejs"); 
});

module.exports = router;