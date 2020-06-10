const express           = require("express"),
    router              = express.Router(),
    commController      = require("../controller/controller_comment"),//controller
    middleware          = require("../middleware"); //only if file name is index.js

//New Comment
router.get("/:id/comments/new", middleware.isLoggedIn, commController.createCommentPage);

//Post new Comment
router.post("/:id/comments", middleware.isLoggedIn, commController.createComment);

//Edit Comment
router.get("/:id/comments/:Comment_id/edit", middleware.checkCommentOwnership, commController.updateCommentPage);

//update data
router.put("/:id/comments/:Comment_id", middleware.checkCommentOwnership, commController.updateComment);

//delete comment
router.delete("/:id/comments/:Comment_id", middleware.checkCommentOwnership, commController.deleteComment);

module.exports = router;