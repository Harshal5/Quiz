const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const addQuestionRouter = require('./routes/addQuestion');
const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');
const startRouter = require('./routes/start');
const quizRouter = require('./routes/quiz');
const logoutRouter = require('./routes/logout');
const User = require('./models/User.model'); 
// const async = require("async");
// const { use } = require("passport");

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
// app.use(express.static("public"));

app.use(express.static(__dirname + '/public'));

app.use(session({
    secret: "Our little secret",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/Online_Quiz", {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set("useFindAndModify", false);

passport.use(User.createStrategy());
 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", function(req, res){
    res.render("home");
});

app.use(addQuestionRouter);

app.use( registerRouter);

app.use(loginRouter);

app.use(startRouter);

app.use(quizRouter);

app.use(logoutRouter);

app.listen(3000, function(){
    console.log("Sever started on port 3000");
});
