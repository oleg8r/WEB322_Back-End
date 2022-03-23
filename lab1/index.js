/*
    class: WEB322
    work: Lab #1
    author: Oleg Savelev
	file: index.js
*/

var HTTP_PORT = process.env.PORT || 3000;

var express = require("express");
var app = express();

app.use(express.json());                                                        //  support json encoded bodies
app.use(express.urlencoded({ extended: false }));                               //  support encoded bodies
                                                                                //  { extended: false } = use querystring library
                                                                                //  { extended: true } = use qs library

app.get("/", function(req, res) {                                               //  Route 1: localhost:3000: A single slash (/) indicates root/home directory
    res.send(`<h1 style='color: #ff0000;'>SUCCESS!</h1>`);
});

app.get("/echo", (req, res) => {                                                //  Route 2: localhost:3000/echo
    res.send(`<h1 style='color: #00ff00;'>SUCCESS! echo</h1>`);
});

app.get("/foxtrot/:kilo?", (req, res) => {                                      //  Route 3: localhost:3000/foxtrot/anyID: 
    var kilo = req.params.kilo;                                                 //  The request paramaters array (req.params) is created by Express to hold incoming 
                                                                                //  values
    res.send(`<h1 style='color: #0000ff;'>SUCCESS! Received ${kilo} via foxtrot </h1>`);
});

app.get("*", (req, res) => {                                                    //  Route wildcard (*): localhost:3000/undefined endpoint 
    res.send(`<h1 style='color: #ff00ff;'>FAILED! Fix your URL.</h1>`);
});

const server = app.listen(HTTP_PORT, () => {
    console.log(`Listening on port ${HTTP_PORT}`);
});

