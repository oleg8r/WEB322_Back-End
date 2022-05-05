////////////////////SERVERAPP.JS////////////////////

/* ======================================================================================================= */

/*
    class: WEB322
    work: Assignment #2 - Library
    due date: March 15, 2022
    author: Oleg Savelev
	file: serverapp.js
	Heroku URL: oleg-savelev-assignment2.herokuapp.com
	Full Link: http://oleg-savelev-assignment2.herokuapp.com/
*/

/* ======================================================================================================= */


////////////////////HEROKU////////////////////
/*
	Heroku URL: oleg-savelev-assignment2.herokuapp.com
	Full Link: http://oleg-savelev-assignment2.herokuapp.com/
*/


////////////////////PORT////////////////////
const HTTP_PORT= process.env.PORT || 3000;


////////////////////MODULES////////////////////								//	Use "require" to bring in module/
const express= require("express");                                         	//	require express as web application framework
const exphbs= require('express-handlebars');								//	require handlebars as templating engine
const path= require("path");												//	require path for folder/file mainpulation
var fs= require("fs");											
const bodyParser= require('body-parser');									//  require body-parser to collect data from request message
const cookieParser= require("cookie-parser");
const session= require("client-sessions");									//	require client-sessions to establish session using cookie
const randomStr= require("randomstring");									//	require randomstring to generate secret string for cookie
// const { getDefaultSettings }= require("http2");
// const { is }= require("express/lib/request");


////////////////////APP////////////////////
const app= express();


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


////////////////////2-SIGN-IN////////////////////

////////////////////2.1.SIGNIN-GET////////////////////
/*  Sign-In page  */

app.get('/signin', (req, res) => {                                   	//  Set up viewData route to "render" the handlebars file with data
	res.render('signin');                                               //  Invokes the render method on the response (res) object
});


// app.post('/signin', (req, res) => {



// 	res.render('signin'); 

// 	// if (req.mySession.user) {
// 	// 	res.render('signin', {											//  Invokes the render method on the response (res) object while identifying index.hbs as 
// 	// 		email: req.mySession.user,									//	the substitute item for the {{{body}}} placeholder inside Sign-In layout (signin.hbs)
// 	// 		message: ''
// 	// 	});
// 	// } else {
// 	// 	req.mySession.reset();
// 	// 	res.redirect('/');
// 	// }
// });


// app.get("/signin", function(req, res){                        		//  GET method          

// 	req.MySession.user = "Unknown";										// sets a cookie with username value

// 	var placeholderValues = {
// 		usernamefromcookie: "TBD",
// 		usernamefromtextbox: "TBD"		
// 	};

// 	res.render('signin', {                                       		//  Invokes the render method on the response (res) object while identifying index.hbs as 
// 		data: placeholderValues											//	the substitute item for the {{{body}}} placeholder inside Sign-In layout (signin.hbs)
// 	});
// });



/*  POST request message submission from client-sessions.hbs page    */
// app.post("/", function(req, res){                                           

// 	var placeholderValues = {
// 		usernamefromcookie: req.MySession.user,
// 		usernamefromtextbox: req.body.txtUN
// 	};

// 	req.MySession.user = req.body.txtUN;									// sets cookie with entered username value

// 	res.render('landing', {                                         
// 		data: placeholderValues
// 	});

// });


/*  Terminates session via reset	*/
app.get("/reset", (req, res) => {

	req.mySession.reset();
	res.redirect('/');

});



////////////////////2.2.SIGNIN-POST////////////////////
app.post('/signin', (req, res) => {									// 1. This app post() method has 2 parameters. 1) path, 2) callback function
	var user_email= req.body.email_input;							// 2. The callback function has 2 parameters: 1) request, 2) response
	var user_psw= req.body.psw_input;

	// sess = req.session;
	// sess.email = user_email;
	// sess.passowrd = user_psw;

	// var data= JSON.parse(fs.readFileSync('./users.json'));   	//  Alt way of reading and parsing a .json file, but no error handling

	fs.readFile('./users.json', 'utf-8', (err, data) => {			// 1. This fs readFile() method has 3 parameters. 1) file, 2) character set, 3) callback function
																	// 2. This callback function will only be executed once the file read is complete
																	// 3. If reading was successful the value of the file will be stored inside this 'data' parameter
																	// 4. If there's anything wrong this callback 'err' parameter will contain TRUE value, and not false
		
		if (err) throw err;											// If there's 1 in the 'err' parameter, the exception will be thrown
		
        var obj_email_psw= JSON.parse(data);						// !A JSON parse() method converts a JSON object into a JavaScript object
																	//	Use the "parse" method to parse a JSON string then construct the JS value or 
                                                                    //	object described by the string

		if (user_email == null && user_psw == null) {
			{message: "Enter username (email) and password"};

		} else if (!obj_email_psw.hasOwnProperty(user_email)) {
			res.render('signin', {message: 'Not a registered username'});

		} else if (obj_email_psw[user_email] != user_psw) {
			res.render('signin', {message: 'Invalid password'});

		} else {
			delete req.body.user_psw;
		
		// Saves the correctly entered user email in the "mySession" cookie file 
		req.mySession.email= user_email;
		// console.log(req.mySession);

		// Saves the correctly entered user password in the "mySession" cookie file 
		req.mySession.pwd= user_psw;
		// console.log(req.mySession.pwd);

		res.cookie("mySession",req.mySession);
		// console.log(req.mySession);

		// return res.render('home', {usernameEmail: `${useremail}`});
		// console.log(user_email);
		// req.mySession.email = user_email;
		// req.mySession.pwd = user_psw;

		res.redirect('/home');
		};
	});
});

// app.post('/logout', (req, res) => {
// 	res.render('landing');
// });


////////////////////3-HOME////////////////////
/*  Home page  */

///HOME PAGE
app.get('/home', (req, res) => {	
	
	// 1. This app post() method has 2 parameters. 1) path, 2) callback function
	if(req.mySession){
		var books_json= JSON.parse(fs.readFileSync('books.json','utf-8'));
		var email= req.mySession.email;
	
		return res.render('home', {data: books_json, user_email:email});	
	}
	else{
		res.redirect('/');
	}

	// var data= fs.readFile('./books.json', 'utf8', (err, jsonString) => {
	// 	if (err) {
	// 		console.log("File read failed:", err)
	// 		return
	// 	}
	// 	console.log('File data:', jsonString) 
		
	// });

	// console.log(data);

	// var books_json= JSON.parse(data);
	// console.log(books_json);

});


///BORROW ENDPOINT
app.post('/home/borrow', (req,res) => {

	if(req.mySession.email){
		var {select_to_borrow}= req.body;

		if(typeof(select_to_borrow) == "string"){
			select_to_borrow= [select_to_borrow];
		}

		var getBooks = JSON.parse(fs.readFileSync('books.json','utf-8'));
		for(let i= 0; i < getBooks.length; i++){
			for(let j= 0; j < select_to_borrow.length; j++){
				if(select_to_borrow[j] == getBooks[i].title) 
				{
					getBooks[i].available= false;
				}
			}
		}

		fs.writeFileSync('books.json',JSON.stringify(getBooks, null, "\t"));
		res.redirect('/home');
	}
	else{
		res.redirect('/');
	}

})


///RETURN ENDPOINT
app.post('/home/return', (req,res) => {

	if(req.mySession.email){
		var {select_to_return}= req.body;

		console.log(select_to_return);
		console.log(typeof(select_to_return))
		
		
		if(typeof(select_to_return)=="string"){
			select_to_return= [select_to_return];
		}
	
		console.log(select_to_return)
	
		var getBooks= JSON.parse(fs.readFileSync('books.json','utf-8'));
		for(let i= 0; i < getBooks.length; i++){
			for(let j= 0; j < select_to_return.length; j++){
				if(select_to_return[j] == getBooks[i].title) 
				{
					getBooks[i].available= true;
				}
			}
		}
	
		fs.writeFileSync('books.json',JSON.stringify(getBooks, null, "\t"));
		return res.redirect('/home');
	}
	else{
		res.redirect('/');
	}

	
})


///OPTION #2
// app.get('/home', (req, res) => {									// 1. This app post() method has 2 parameters. 1) path, 2) callback function

// 	var books_json= JSON.parse(fs.readFileSync('./books.json'));
// 	console.log(books_json);

// 			// return res.render('home', {books_json: `${title}`, books_json: `${author}`, books_json: available});	//  Set up viewData route to "render" the handlebars file with data
// 			// return res.render('/borrow', {books_json: title, books_json: author, books_json: available});		//  Invokes the render method on the response (res) object
// 			// res.redirect('/borrow');

// 	return res.render('home', {data: books_json});	
// 	});
	
// ///OPTION #1
// function jsonReader(filePath, cb) {
//     fs.readFile(filePath, (err, fileData) => {
//         if (err) {
//             return cb && cb(err)
//         }
//         try {
//             const object = JSON.parse(fileData)
//             return cb && cb(null, object)
//         } catch(err) {
//             return cb && cb(err)
//         }
//     })
// }
// jsonReader('./books.json', (err, customer) => {
//     if (err) {
//         console.log(err)
//         return
//     }
//     console.log(customer.address) // => "Infinity Loop Drive"
// })


// ///OPTION #3
// var data=fs.readFileSync('books.json', 'utf8');
// var books=JSON.parse(data);
// console.log(books);
// return res.render('home', {data: books});



// var books_json= JSON.parse(fs.readFileSync('./books.json'));


// ///OPTION #4
// app.get('/home', (req, res) => {									// 1. This app post() method has 2 parameters. 1) path, 2) callback function

// 	fs.readFile('./books.json', 'utf-8', (err, data) => {			// 1. This fs readFile() method has 3 parameters. 1) file, 2) character set, 3) callback function
// 																	// 2. This callback function will only be executed once the file read is complete
// 																	// 3. If reading was successful the value of the file will be stored inside this 'data' parameter
// 																	// 4. If there's anything wrong this callback 'err' parameter will contain TRUE value, and not false
		
// 		if (err) throw err;											// If there's 1 in the 'err' parameter, the exception will be thrown
		
// 		var books_json= JSON.parse(data);						// !A JSON parse() method converts a JSON object into a JavaScript object
// 																	//	Use the "parse" method to parse a JSON string then construct the JS value or 
// 																	//	object described by the string

// 			// return res.render('home', {usernameEmail: `${useremail}`});
// 			return res.render('home', {data: books_json});

// 			// res.redirect('/home');
// 	});
// });




	


////////////////////LISTEN////////////////////
const server= app.listen(HTTP_PORT, () => {
    console.log(`Listening on port ${HTTP_PORT}`);
});
