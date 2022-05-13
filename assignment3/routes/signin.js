
/*
	signin.js
	author: Oleg Savelev
*/

////////////////////MODULES////////////////////							//	Use "require" to bring in module/
const express= require("express");                                     	//	require express as web application framework
const router = express.Router();
var fs= require("fs");	


////////////////////2-SIGN-IN////////////////////

////////////////////2.1.SIGNIN-GET////////////////////
/*  Sign-In page  */
                                    //  Do not specify '/signin'. It will not work, because we're already in a router file with this name
router.get('/', (req, res) => {                                        //  Set up viewData route to "render" the handlebars file with data
	res.render('signin');                                              //  Invokes the render method on the response (res) object. It looks for it in the "view" folder
});



////////////////////2.2.SIGNIN-POST////////////////////
                                          //  Do not specify '/signin'. It will not work, because we're already in a router file with this name
router.post('/', (req, res) => {								// 1. This app post() method has 2 parameters. 1) path, 2) callback function
	// var user_email= req.body.email_input;							// 2. The callback function has 2 parameters: 1) request, 2) response
	// var user_psw= req.body.psw_input;

	// var data= JSON.parse(fs.readFileSync('./users.json'));   	//  Alt way of reading and parsing a .json file, but no error handling

	fs.readFile('./users.json', 'utf-8', (err, data) => {			// 1. This fs readFile() method has 3 parameters. 1) file, 2) character set, 3) callback function
																	// 2. This callback function will only be executed once the file read is complete
																	// 3. If reading was successful the value of the file will be stored inside this 'data' parameter
																	// 4. If there's anything wrong this callback 'err' parameter will contain TRUE value, and not false
		
		if (err) throw err;											// If there's 1 in the 'err' parameter, the exception will be thrown
		

        var user_email= req.body.email_input;							// 2. The callback function has 2 parameters: 1) request, 2) response
        var user_psw= req.body.psw_input;
    
        // var data= JSON.parse(fs.readFileSync('./users.json'));   	//  Alt way of reading and parsing a .json file, but no error handling



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
		
		req.mySession.email= user_email;
		req.mySession.pwd= user_psw;


		res.cookie("mySession",req.mySession);


		res.redirect('/home');
		};
	});
});

module.exports = router;