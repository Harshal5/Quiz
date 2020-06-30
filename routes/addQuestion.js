const router = require('express').Router();
const Bank = require('../models/Bank.model');

router.get("/addQuestion", function(req, res){
    res.render("addQuestion");
});

router.post("/addQuestion", function(req, res){

    const newQuestion = new Bank({
        question:req.body.question,
        option1:req.body.option1,
        option2:req.body.option2,
        option3:req.body.option3,
        option4:req.body.option4,
        correct:req.body.correct
    })

    newQuestion.save(function(err){
        if(err){
            console.log(err);
        }   else{
            res.render("addQuestion");
        }
    });
});

module.exports = router;