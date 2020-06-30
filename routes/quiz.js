const router = require('express').Router();
const User = require('../models/User.model');
const Bank = require('../models/Bank.model');

router.get("/quiz/:userId/:questionId", function (req, res) {

    userId = req.params.userId;
    questionId = req.params.questionId;
    User.findById(userId, function(err, checkUser){
        if(!err){
            questionArr = checkUser.questions;
            questionArr.forEach(function(checkQuestion){
                if(checkQuestion._id == questionId){
                    if(checkQuestion.attempt == false){
                        Bank.findById(questionId, function(err, bank){
                            if(!err){
                                res.render("quiz", {
                                    userId:userId,
                                    questionId:questionId,
                                    question:bank.question,
                                    option1:bank.option1,
                                    option2:bank.option2,
                                    option3:bank.option3,
                                    option4:bank.option4,
                                    id:userId
                                });
                            }
                        }); 
                    }
                }
            });
        }
    });
      


});

router.post("/quiz/:userId/:questionId", function(req, res){

    const userId = req.params.userId;
    const questionId = req.params.questionId;
    const markedAnswer = req.body.option;

    User.updateOne({"_id":userId, "questions._id": questionId},
    {$set: {
        "questions.$.marked" : markedAnswer, "questions.$.attempt" : true
    }}, function(err){
        if(err){
            console.log(err);
        }
    });

    User.updateOne({ _id: userId },
        { "$pull": { 
            "remaining": { "_id": questionId } 
        }}, { safe: true, multi:true }, function(err, obj) {
        if(err){
            console.log(err);
        }
    });

    User.findById(userId, function(err, calcUser){
        calcArr = calcUser.questions;
        calcArr.forEach(function(calcQuestion){
            if(calcQuestion._id == questionId){
                Bank.findById(questionId, function(err, calcBankQuestion){
                    if(calcQuestion.marked == calcBankQuestion.correct){
                        calcUser.score+=1;
                        calcUser.save();
                    }
                });
            }
        });
    });
    
    User.findById(userId, function(err, foundUser){
        try{
            nextQuestionId = foundUser.remaining[0]._id;
            res.redirect("/quiz/"+userId+"/"+nextQuestionId);
        } catch(err){
            foundUser.end = true;
            foundUser.save();
            res.redirect("/logout");
        }
    });

});

module.exports = router;