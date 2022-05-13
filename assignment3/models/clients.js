

////////////////////MONGODB/MONGOOSE////////////////////
const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://dbuser:dbpsw123@cluster0.tsj42.mongodb.net/library?retryWrites=true&w=majority");

var Schema = mongoose.Schema;
const Client = mongoose.model('Client',Schema({
    Username:String,
    IDBooksBorrowed:{type:Array,'default':[]}
}));

module.exports = Client;
//     ID: String,
//     Title: String,
//     Author: String,
//     Available: Boolean
// }, {                                                                                
//     versionKey: false                                                               //  Suppresses versioning
// });