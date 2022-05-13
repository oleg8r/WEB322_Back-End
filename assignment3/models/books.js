

////////////////////MONGODB/MONGOOSE////////////////////
const res = require("express/lib/response");
const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://dbuser:dbpsw123@cluster0.tsj42.mongodb.net/library?retryWrites=true&w=majority");

var Schema = mongoose.Schema;
// var bookSchema = new Schema({
//     id: String,
//     Title: String,
//     Author: String,
//     Available: Boolean
// }, {                                                                                
//     versionKey: false                                                               //  Suppresses versioning
// });

const Book = mongoose.model('Book', Schema({
    id: String,
    Title: String,
    Author: String,
    Available: Boolean
}));



module.exports = Book;