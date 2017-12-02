const express = require("express");
const router  = express.Router({mergeParams: true});
const Cabin = require("../models/cabin");
const Comment = require("../models/comment");
const middleware = require("../middleware");
const { isLoggedIn, checkUserComment, isAdmin } = middleware;

//Comments New
router.get("/new", isLoggedIn, function(req, res){
    // find cabin by id
    console.log(req.params.id);
    Cabin.findById(req.params.id, function(err, cabin){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {cabin: cabin});
        }
    })
});

//Comments Create
router.post("/", isLoggedIn, function(req, res){
   //lookup cabin using ID
   Cabin.findById(req.params.id, function(err, cabin){
       if(err){
           console.log(err);
           res.redirect("/cabins");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
               //add username and id to comment
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               //save comment
               comment.save();
               cabin.comments.push(comment);
               cabin.save();
               console.log(comment);
               req.flash('success', 'Created a comment!');
               res.redirect('/cabins/' + cabin._id);
           }
        });
       }
   });
});

router.get("/:commentId/edit", isLoggedIn, checkUserComment, function(req, res){
  res.render("comments/edit", {campground_id: req.params.id, comment: req.comment});
});

router.put("/:commentId", isAdmin, function(req, res){
   Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, function(err, comment){
       if(err){
          console.log(err);
           res.render("edit");
       } else {
           res.redirect("/cabins/" + req.params.id);
       }
   }); 
});

router.delete("/:commentId", isLoggedIn, checkUserComment, function(req, res){
  // find cabin, remove comment from comments array, delete comment in db
  Cabin.findByIdAndUpdate(req.params.id, {
    $pull: {
      comments: req.comment.id
    }
  }, function(err) {
    if(err){ 
        console.log(err)
        req.flash('error', err.message);
        res.redirect('/');
    } else {
        req.comment.remove(function(err) {
          if(err) {
            req.flash('error', err.message);
            return res.redirect('/');
          }
          req.flash('error', 'Comment deleted!');
          res.redirect("/cabins/" + req.params.id);
        });
    }
  });
});

module.exports = router;