////////////////////FUNCTIONS.JS////////////////////

/* ======================================================================================================= */

/*
    class: WEB322
    work: Assignment #3 - Library
    due date: April 12, 2022
    author: Oleg Savelev
	file: functions.js
	Heroku URL: oleg-savelev-assignment3.herokuapp.com
	Full Link: http://oleg-savelev-assignment3.herokuapp.com/
*/

/* ======================================================================================================= */


////////////////////HEROKU////////////////////
/*
	Heroku URL: oleg-savelev-assignment3.herokuapp.com
	Full Link: http://oleg-savelev-assignment3.herokuapp.com/
*/


////////////////////FUNCTIONS////////////////////
//  Home page functions

//LISTENERS
document.getElementById("id_btn_borrow").addEventListener("click", submitBorrow);
document.getElementById("id_btn_return").addEventListener("click", submitReturn);


//BORROW
// Checks if any checkbox is selected
function setBorrowButton() {

    console.log(`function setBorrowButton`);
    let btn= document.getElementById("id_btn_borrow");
//    console.log(`btn.value = ${btn.value}`);

    let chkBooks= document.getElementsByName("select_to_borrow");
    btn.disabled= true;
    chkBooks.forEach( e => {
        console.log(`e.id = ${e.id} e.checked = ${e.checked}`);
        if (e.checked) {
            btn.disabled= false;
        }
    });
}


function submitBorrow() {

    let chkBooks= document.getElementsByName("select_to_borrow");
    var checkedBooks= [];
    chkBooks.forEach(e => {
        if(e.checked){
            checkedBooks.push(e.value);
        }
    });

    console.log(checkedBooks)

    // document.getElementById("id_form_home_page").action = "/home";
    // document.getElementById("id_form_home_page").action = "/home/borrow";
    document.getElementById("id_left_form_home").submit();
}

let select_to_borrow= document.getElementsByName("select_to_borrow");

select_to_borrow.forEach( e => {
    e.addEventListener("change", setBorrowButton);
    console.log(`${e.id}`);
});


//RETURN
function setReturnButton() {

    console.log(`function setReturnButton`);
    let btnrnt= document.getElementById("id_btn_return");
//    console.log(`btn.value = ${btn.value}`);

    let chkBooks= document.getElementsByName("select_to_return");
    btnrnt.disabled= true;
    chkBooks.forEach( e => {
        console.log(`e.id = ${e.id} e.checked = ${e.checked}`);
        if (e.checked) {
            btnrnt.disabled= false;
        }
    });
}

function submitReturn() {

    let chkBooks= document.getElementsByName("select_to_return");
    var checkedBooks= [];
    chkBooks.forEach(e => {
        if(e.checked){
            checkedBooks.push(e.value);
        }
    });

    console.log(checkedBooks)

    document.getElementById("id_right_form_home").submit();
}

let select_to_return= document.getElementsByName("select_to_return");

select_to_return.forEach( e => {
    e.addEventListener("change", setReturnButton);
    console.log(`${e.id}`);
});


