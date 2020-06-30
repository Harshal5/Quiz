const router = require('express').Router();
const User = require('../models/User.model');
const passport = require('passport');


router.get("/register", function(req, res){
    res.render("register");
});

router.post("/register", function(req, res){
    
    User.register({username: req.body.username, score: 0, end: false}, req.body.password, function(err, user){
        if(err){
            console.log(err);
            res.redirect("/register");
        }   else{
            passport.authenticate("local")(req, res, function(){
                res.redirect("/register");
            });
        }
    });

});

module.exports = router;
