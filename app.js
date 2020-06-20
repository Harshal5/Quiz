const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
// const async = require("async");
// const { use } = require("passport");

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.use(session({
    secret: "Our little secret",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/Online_Quiz", {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set("useFindAndModify", false);


const bankSchema = new mongoose.Schema({
    question : String,
    option1 : String,
    option2 : String,
    option3 : String,
    option4 : String,
    correct : String
});

const Bank = mongoose.model("Bank", bankSchema);



const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    // roll: String,
    questions: [{
        // id: {
        //     type : mongoose.Schema.Types.ObjectId,
        //     ref: 'Bank'},
        attempt: Boolean,
        marked: String
    }],
    remaining: [{
        no : String
    }],
    score: Number,
    end: Boolean
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

passport.use(User.createStrategy());
 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get("/", function(req, res){
    res.send("Hello");
});




app.get("/addQuestion", function(req, res){
    res.render("addQuestion");
});

app.post("/addQuestion", function(req, res){

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




app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){
    
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




app.get("/login", function(req, res){
    if(req.isAuthenticated()){
        res.render("login");
      } else {
          res.render("login")
      }
});

app.post("/login", function(req, res){

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




app.get("/start/:userId", function(req, res){
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

app.post("/start/:userId", function(req, res){
    
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
    //res.redirect("/quiz/" + userId + "/" + )
    
});




app.get("/quiz/:userId/:questionId", function (req, res) {

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

app.post("/quiz/:userId/:questionId", function(req, res){

    const userId = req.params.userId;
    const questionId = req.params.questionId;
    const markedAnswer = req.body.option;


    // User.findById(userId, function(err, currentUser){
    //     if(!err){
    //        currentUser.updateOne({'questions._id': questionId}, {'$set': {
    //            'questions.$.marked' : markedAnswer,
    //            'questions.$.attempt' : true
    //        }},function(err){
    //             if(err){
    //                 console.log(err);
    //             }
    //        });
    //     }
    // });

    // User.findById(userId, function(err, delUser){
    //     if(!err){
    //         console.log(delUser.remaining);
            
    //     }
    // });

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


    
    // User.findById(userId,function(err, currentUser){
    //  if(!err){
    //     questionsArr = currentUser.questions; 
        // questionsArr.forEach(function(eachQuestion){
        //     if(eachQuestion.attempt == false){
        //         questionId = eachQuestion._id;
        //         //res.redirect("/quiz/"+userId+"/"+questionId);
        //         console.log("/quiz/"+userId+"/"+questionId);
        //     }
        // });
    //     async.each(questionsArr, function(each){
    //         checkAttempt = each.attempt;
    //         //console.log(checkAttempt);
    //         var newQuestionId = each._id; 
    //         if(checkAttempt == false){
    //             res.redirect("/quiz/"+userId+"/"+newQuestionId);
    //         }
    //     });
    //     res.send("asd");
    //  }
    // });
    

    


// console.log(questionsArr);
        // questionsArr.forEach(function(each){
        //     checkAttempt = each.attempt;
        //     console.log(checkAttempt);
        //     var newQuestionId = each._id; 
        //     if(checkAttempt == false){
        //         res.redirect("/quiz/"+userId+"/"+newQuestionId);
        //     } 
        // });





//    res.send("finished");
    //res.redirect("/addQuestion");
});





app.get("/logout", function(req, res){   
    req.logOut();
    res.render("logout");
});

app.listen(3000, function(){
    console.log("Sever started on port 3000");
});
