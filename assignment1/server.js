////////////////////INFO////////////////////
/* ======================================================================================================= */

/*
    class: WEB322
    work: Assignment #1 - Library
    due date: February 15, 2022
    author: Oleg Savelev
	file: server.js
*/

/* ======================================================================================================= */


////////////////////PORT////////////////////
const HTTP_PORT = process.env.PORT || 3000;


////////////////////MODULES////////////////////
const express = require("express");                                         //	Use "require" to bring in module/
const exphbs = require('express-handlebars');
const path = require("path");
var fs = require("fs");											
const bodyParser = require('body-parser');


////////////////////APP////////////////////
const app = express();


////////////////////STATIC////////////////////
app.use("/", express.static("public"));										//	Set the public subfolder as the default folder
app.use("/images", express.static(__dirname + "/images"));					//	Set the images subfolder as the default folder for the /images route
app.use("/views", express.static(__dirname + "/views"));					//	Set the images subfolder as the default folder for the /images route


////////////////////EXPRESS////////////////////
app.use(express.json());                                                        //  support json encoded bodies
app.use(express.urlencoded({ extended: false }));                               //  support encoded bodies
                                                                                //  { extended: false } = use querystring library
                                                                                //  { extended: true } = use qs library

////////////////////BODYPARSER////////////////////                                                                                 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


////////////////////HANDLEBARS////////////////////                                                                                
app.engine(".hbs", exphbs.engine({ 												//	1st parameter: "hbs" is to be the internal engine name for express-handlebars
    extname: ".hbs",                                                        //  2nd parameter: callback that    1. specifies the extension name,
    defaultLayout: false,                                                   //                                  2. override the default template layout of "main",
    layoutsDir: path.join(__dirname, "/views")                              //                                  3. identifies the template directory
}));

app.set("view engine", ".hbs");                                             //  Identifies hbs (the internal engine name) as the view engine to be used for this server program


////////////////////ROUTES////////////////////
app.get('/', (req, res) => {                                           	//  Set up viewData route to "render" the handlebars file with data
	res.render('landing');                                              //  Invokes the render method on the response (res) object
});

app.get('/signin', (req, res) => {                                      //  Set up viewData route to "render" the handlebars file with data
	res.render('signin');                                               //  Invokes the render method on the response (res) object
});

app.get('/home', (req, res) => {                                       	//  Set up viewData route to "render" the handlebars file with data
	res.render('home');                                                	//  Invokes the render method on the response (res) object
});


////////////////////POST////////////////////
app.post('/signin', (req, res) => {
	var useremail = req.body.email_input;
	var userpsw = req.body.psw_input;

	fs.readFile('users.json', 'utf-8', (err, data) => {
		if (err) {
			throw err;
		}
		
        var data = JSON.parse(data);								//	Use the "parse" method to parse a JSON string then construct the JS value or 
                                                                    //	object described by the string

		if (useremail == null && userpsw == null){
			{message: "Enter username (email) and password"};

		} else if (!data.hasOwnProperty(useremail)) {
			res.render('signin', {message: 'Not a registered username'});

		} else if (data[useremail] != userpsw) {
			res.render('signin', {message: 'Invalid password'});

		} else {
			delete req.body.userpsw;
			// return res.render('home', {usernameEmail: `${useremail}`});
			return res.render('home', {usernameEmail: useremail});
			// res.redirect('/home');
			};
		});
});

// app.post('/logout', (req, res) => {
// 	res.render('landing');
// });


////////////////////LISTEN////////////////////
const server = app.listen(HTTP_PORT, () => {
    console.log(`Listening on port ${HTTP_PORT}`);
});