const router = require('express').Router();
const User = require('../models/User.model');
const passport = require('passport');

router.get("/login", function(req, res){
    if(req.isAuthenticated()){
        res.render("login");
      } else {
          res.render("login")
      }
});

router.post("/login", function(req, res){

    const user = new User({
        username: req.body.username,
        password: req.body.password
    });

    req.login(user, function(err){
        if(err){
            console.log(err);
        }   else{
            passport.authenticate("local")(req, res, function(){
                User.findOne({username: req.body.username}, function(err, obj){
                    res.redirect("/start/" + obj._id); 
                });
            });
        }
    })

});

module.exports = router;