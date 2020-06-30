const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

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


module.exports = User;