var rejectList = ["google.com", "yahoo.com"];

function validateEmailField() {
    var emailValue = $('#email-input').val(); // To Get Value (can use getElementById)
    var splitArray = emailValue.split('@'); // To Get Array

    if (rejectList.indexOf(splitArray[1]) >= 0) {
        // Means it has the rejected domains
        //return false;
        alert("please choose a qualified email address")
    }
    return true;

}