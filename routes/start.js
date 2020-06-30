const router = require('express').Router();
const User = require('../models/User.model');
const Bank = require('../models/Bank.model');

router.get("/start/:userId", function(req, res){
    if(req.isAuthenticated()){
        const userId = req.params.userId;
        User.findById(userId, function(err, tryUser){
            if(!err){
                if(tryUser.end == false){
                    tryArr = tryUser.remaining;
                    if(!tryArr.length){
                        Bank.find({}, function(err, forIds){
                            forIds.forEach(function(forId){
                                User.findById(userId, function(err, updateUser){
                                    if(!err){
                                        //console.log(forId._id);
                                        dic={
                                            _id : forId._id,
                                            attempt : false,
                                            marked : null
                                        }
                                    
                                        dic2= {
                                            _id: forId._id,
                                            no : 'No'
                                        }
                                    
                                        updateUser.questions.push(dic);
                                        updateUser.remaining.push(dic2);
                                        updateUser.save();
                                    }
                                });
                            });
                        });
                    }
                }   
            }
        });
        
        User.findById(userId, function(err, checkTrue){
            if(!err){
                if(checkTrue.end == false){
                    res.render("start.ejs", {
                        userId: userId
                    });
                } else{
                        res.redirect("/logout");
                } 
            }
        });
        
    }
});
 
router.post("/start/:userId", function(req, res){
     
    const userId = req.params.userId;
    let questionId = 0;
    if(req.body.option){

        User.findById(userId, function(err, currentUser){
            if(!err){
                questionId =currentUser.remaining[0]._id;
                res.redirect("/quiz/"+userId+"/"+questionId);
            }
        });
    }
     
 });

 module.exports = router;