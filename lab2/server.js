////////////////////INFO////////////////////

/* ======================================================================================================= */

/*
    class: WEB322
    work: Lab #2 - Heroku
    due date: March 01, 2022
    author: Oleg Savelev
	  file: server.js
    Heroku URL: oleg-savelev-lab2.herokuapp.com
*/

/* ======================================================================================================= */


////////////////////CODE////////////////////

// Heroku URL: oleg-savelev-lab2.herokuapp.com

var HTTP_PORT = process.env.PORT || 3000;

const express = require("express");
const app = express();

app.get("/", function (req, res) {
  res.send(`Hello Heroku!`);

});

var server = app.listen(HTTP_PORT, function () {
	console.log("Listening on port " + HTTP_PORT);
});
