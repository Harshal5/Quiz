const mongoose = require('mongoose');

const bankSchema = new mongoose.Schema({
    question : String,
    option1 : String,
    option2 : String,
    option3 : String,
    option4 : String,
    correct : String
});

const Bank = mongoose.model("Bank", bankSchema);

module.exports = Bank;