
var rejectList = ["google.com", "yahoo.com"]; //add list of domains to reject

function validateEmailField() {
    var emailValue = document.getElementById('Email').value 
    var splitArray = emailValue.split('@'); // To Get Array

    if (rejectList.indexOf(splitArray[1]) >= 0) {
        // Means it has the rejected domains
        //return false;
        alert("please choose a qualified email address")
    }
    return true;

}