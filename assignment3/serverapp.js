////////////////////SERVERAPP.JS////////////////////

/* ======================================================================================================= */

/*
    class: WEB322
    work: Assignment #3 - Library
    due date: April 12, 2022
    author: Oleg Savelev
	file: serverapp.js
	Heroku URL: oleg-savelev-assignment3.herokuapp.com
	Full Link: http://oleg-savelev-assignment3.herokuapp.com/
*/

/* ======================================================================================================= */


////////////////////HEROKU////////////////////
/*
	Heroku URL: oleg-savelev-assignment3.herokuapp.com
	Full Link: http://oleg-savelev-assignment3.herokuapp.com/
*/


////////////////////PORT////////////////////
const HTTP_PORT= process.env.PORT || 3000;
// const host = '0.0.0.0';

////////////////////MODULES////////////////////								//	Use "require" to bring in module/
const express= require("express");                                         	//	require express as web application framework
const exphbs= require('express-handlebars');								//	require handlebars as templating engine
const path= require("path");												//	require path for folder/file mainpulation
var fs= require("fs");	
const app= express();										
const bodyParser= require('body-parser');									//  require body-parser to collect data from request message
const cookieParser= require("cookie-parser");
const session= require("client-sessions");									//	require client-sessions to establish session using cookie
const randomStr= require("randomstring");									//	require randomstring to generate secret string for cookie
// const MongoClient = require("mongodb").MongoClient;						//	require MongoDB and create MongoClient object
// const mongoose = require('mongoose');
// const  MongoS = require('connect-mongo');



const signin_route = require("./routes/signin.js");
const Books = require("./models/books.js");
const Clients = require("./models/clients.js");
const { type } = require("express/lib/response");
const Book = require("./models/books.js");


////////////////////APP////////////////////
// const app= express();

// app.use("/signin", signin);													// If a route mentions "/signin" refer to the file "signin.js"

////////////////////STATIC////////////////////                   			//  *** Identify the folders containing static files such as images and CSS files
app.use("/", express.static("public"));										//	Set the public subfolder as the default folder
// app.use(express.static('home'));
app.use("/images", express.static(__dirname + "/images"));					//	Set the images subfolder as the default folder for the /images route
app.use("/views", express.static(__dirname + "/views"));					//	Set the images subfolder as the default folder for the /images route


////////////////////EXPRESS////////////////////
app.use(express.json());                                                    //  support json encoded bodies
app.use(express.urlencoded({ extended: false }));                           //  support encoded bodies
                                                                        	//  { extended: false } = use querystring library
                                                                        	//  { extended: true } = use qs library

////////////////////BODYPARSER////////////////////                                                                                 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


////////////////////COOKIEPARSER//////////////////// 
app.use(cookieParser());


////////////////////HANDLEBARS////////////////////                          //  Identifies(s) file with .hbs extension being the template                                                                                
app.engine(".hbs", exphbs.engine({ 											//	1st parameter: "hbs" is to be the internal engine name for express-handlebars
    extname: ".hbs",                                                        //  2nd parameter: callback that    1) specifies the extension name,
    defaultLayout: false,                                                   //  2) override the default template layout of "main" (because my template files are not called main),
    layoutsDir: path.join(__dirname, "/views")                              //  3) identifies the template directory (all handlebars requests go to "/view" folder)
}));

app.set("view engine", ".hbs");                                             //  Identifies hbs (the internal engine name) as the view engine to be used for this server program
app.set('trust proxy', 1);


////////////////////RANDOM////////////////////								
var strRandom = randomStr.generate();					// We use Random for security. It lets us avoid a dangerous practice of hardcoding credential information


////////////////////SESSION////////////////////			//	This "client-sessions" middleware creates a cookie
app.use(session({										//	Adds session handler middleware

	cookieName: "mySession",
//	secret: "abc123",									//	Do not use a Static secret. For security use a Random secret (see the next line)
	secret: strRandom,      							//	Random string
	duration: 5 * 60 * 1000,							//	Session duration: 5 minutes * 60 sec/min * 1000 milliseconds
	activeDuration: 3 * 60 * 1000,						//	Session expiration: the session terminates after 3 minutes of inactivity (assignment requirement)...
														//	...beyond the 5 minutes session duration (For example, 3 min of inactivity within 5 minutes terminates the session)
    httpOnly: true,                                     //  prevents browser JavaScript from accessing cookies
    secure: true,                                       //  ensures cookies are only used over https
    ephemeral: true,                                     //  deletes the cookie when the browser is closed
}));



////////////////////ROUTES(ENDPOINTS)////////////////////
/////////////Located in Relevant Route Files/////////////

/*  Terminates session via reset	*/
app.get("/reset", (req, res) => {

	req.mySession.reset();
	res.redirect('/');

});

////////////////////1-LANDING////////////////////
/*  Initial access via browser address bar  */
app.get("/", function(req, res){                                        //  GET method
	
	var placeholderValues = {
		a: "Dear Friends! Welcome to the Web Books Library site!",
		b: "Please click on the \"Sign In\" label in the top right corner to sign in using your username and password.",
		c: "If you don't have a Web Books Library account you will be able to register on our web site."
	};

	res.render('landing', {                                             //  Invokes the render method on the response (res) object while identifying landing.hbs as the 																			
		data: placeholderValues											//	substitute item for the {{{body}}} placeholder inside default layout (main.hbs)
	});
});


// ////////////////////2-SIGN-IN////////////////////

app.use("/signin", signin_route);													// If a route mentions "/signin" refer to the file "signin.js"




////////////////////3-HOME////////////////////
/*  Home page  */

///HOME PAGE
app.get('/home', (req, res) => {	
	


	// 1. This app post() method has 2 parameters. 1) path, 2) callback function
	if(req.mySession){
		// var books_json= JSON.parse(fs.readFileSync('books.json','utf-8'));
		var email= req.mySession.email;
		
		Clients.findOne({'Username':email}).lean().exec(function(error, client){
			if(client.IDBooksBorrowed.length > 0){
				Books.find({'id':client.IDBooksBorrowed}).lean().exec(function(err,borrowedBooks){
					Books.find({'Available':true}).lean().exec(function(error, availBooks){
						return res.render('home', {data: availBooks,borrowed:borrowedBooks, user_email:email});
					})
				})
				// Books.find({$or:[{'id':{$in:client.IDBooksBorrowed}},{'Available':true}]}).lean().exec(function(error,allBooks){
				// 	return res.render('home', {data: allBooks, user_email:email});
				// })
			}
			else{
				Books.find({'Available':true}).lean().exec(function(error, availBooks){
					return res.render('home', {data: availBooks,borrowed:[], user_email:email});
				})
			}
			
		})
		
		// Books.find({}).lean().exec(function(error, allbooks){
		// 	console.log(allbooks);
		// 	return res.render('home', {data: allbooks, user_email:email});
		// })
		
		// Books.find({},(err, allBooks) => {
		// 	if (err) console.log(err);

		// 	// console.log(availBooks);			

		// 	// console.log(allBooks);
		// 	// console.log(typeof allBooks);
		// 	books_json = JSON.stringify(allBooks);
		// 	console.log(allBooks);

			
	
				
		// })	
		
	}
	else{
		res.redirect('/');
	}


});


///BORROW ENDPOINT
app.post('/home/borrow', (req,res) => {

	if(req.mySession.email){

		var email= req.mySession.email;
		var {select_to_borrow}= req.body;
		
		if(typeof(select_to_borrow) == "string"){
			select_to_borrow= [select_to_borrow];
		}
		console.log('BOOKS',select_to_borrow)
	

		select_to_borrow.forEach(element => {
			Books.findOneAndUpdate({'id':element},{"Available":false},function(err,result){
				console.log('Update',result);
			})

			// Logs.findOneAndUpdate({bookid: req.body.bookid}, {$set: {status:"Issued"}}, {$push: {details:detail}}, {upsert: true}).then((result) => {
			// 	console.log(result)
			//   }.catch((error) => {
			// 	console.log(error)
			//   }
			// Books.findByIdAndUpdate({element},{"Available":false},function(err, result){
			// 	Clients.findOneAndUpdate(
			// 		{ 'Username': email},
			// 		{ $push: { 
			// 			'IDBooksBorrowed': book_id_array 
			// 				} 
			// 		})
			// 	// Clients.findOne({'Username':email}).lean().exec(function(error,client){
			// 		return res.render('home', {data: result, user_email:email});
			// 	// })
			// })
		});

		Clients.findOneAndUpdate({'Username':email},{
			$push:{IDBooksBorrowed: { $each: select_to_borrow}}},{upsert:true}).then((result) => {
			console.log(result)
			res.redirect('/home');
		})



		// var getBooks = JSON.parse(fs.readFileSync('books.json','utf-8'));
		// for(let i= 0; i < getBooks.length; i++){
		// 	for(let j= 0; j < select_to_borrow.length; j++){
		// 		if(select_to_borrow[j] == getBooks[i].title) 
		// 		{
		// 			getBooks[i].available= false;
		// 		}
		// 	}
		// }

		// fs.writeFileSync('books.json',JSON.stringify(getBooks, null, "\t"));
		
	}
	else{
		res.redirect('/');
	}

})


///RETURN ENDPOINT
app.post('/home/return', (req,res) => {
	var email= req.mySession.email;
	if(req.mySession.email){
		var {select_to_return}= req.body;

		console.log(select_to_return);
		console.log(typeof(select_to_return))
		
		
		if(typeof(select_to_return)=="string"){
			select_to_return= [select_to_return];
		}
	
		console.log(select_to_return)

		select_to_return.forEach(element => {
			Books.findOneAndUpdate({'id':element},{"Available":true},function(err,result){
				console.log('Update',result);
			})
		})

		Clients.findOneAndUpdate({'Username':email},{
			$pull:{IDBooksBorrowed: { $in: select_to_return}}},{upsert:true}).then((result) => {
			console.log(result)
			res.redirect('/home');
		})
	
		// var getBooks= JSON.parse(fs.readFileSync('books.json','utf-8'));
		// for(let i= 0; i < getBooks.length; i++){
		// 	for(let j= 0; j < select_to_return.length; j++){
		// 		if(select_to_return[j] == getBooks[i].title) 
		// 		{
		// 			getBooks[i].available= true;
		// 		}
		// 	}
		// }
	
		// fs.writeFileSync('books.json',JSON.stringify(getBooks, null, "\t"));
		// return res.redirect('/home');
	}
	else{
		res.redirect('/');
	}

	
})




////////////////////LISTEN////////////////////
const server= app.listen(HTTP_PORT, () => {
    console.log(`Listening on port ${HTTP_PORT}`);
});
