
function notAttending(status) {
    var hide = document.getElementsByClassName('formToggle');
    var lengthOfArray = hide.length;

    for (var i = 0; i < lengthOfArray; i++) {
        hide[i].style.display = 'none';
    }

    var changeNoValue = document.querySelector('#no');
    changeNoValue.dataset.rsvp = "no"

    var changeYesValue = document.querySelector('#yes');
    changeYesValue.dataset.rsvp = ""

};

function attending(status) {
    var show = document.getElementsByClassName('formToggle');
    var lengthOfArray = show.length;

    for (var i = 0; i < lengthOfArray; i++) {
        show[i].style.display = 'block';
    }

    var changeYesValue = document.querySelector('#yes');
    changeYesValue.dataset.rsvp = "yes"

    var changeNoValue = document.querySelector('#no');
    changeNoValue.dataset.rsvp = ""

};

function submitData() {
    var handicapIndexValue = document.getElementById("handicapValue").value
    handicapIndexValue.value = "0.0"


    if (handicapIndexValue == "") {
        document.getElementById('handicapValue').value = '0.0'
    }
    else {
    }
}
