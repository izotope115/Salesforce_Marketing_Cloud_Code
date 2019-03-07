/* eslint-disable */
//Set the number of days before your cookie should expire
var ExpireDays = 90;
//Do not change anything below this line
qstr = document.location.search;
qstr = qstr.substring(1, qstr.length);

function SetCookie(cookieName, cookieValue, nDays) {
    var today = new Date();
    var expire = new Date();
    if (nDays == null || nDays == 0) nDays = 1;
    expire.setTime(today.getTime() + 3600000 * 24 * nDays);
    document.cookie =
        cookieName +
        "=" +
        escape(cookieValue) +
        "; expires=" +
        expire.toGMTString() +
        "; path=/";
}
thevars = qstr.split("&");
for (i = 0; i < thevars.length; i++) {
    cookiecase = thevars[i].split("=");
    switch (cookiecase[0]) {
        case "sfmc_sub":
            sfmc_sub = cookiecase[1];
            SetCookie("SubscriberID", sfmc_sub, ExpireDays);
            break;
        case "e":
            e = cookiecase[1];
            SetCookie("EmailAddr_", e, ExpireDays);
            break;
        case "j":
            j = cookiecase[1];
            SetCookie("JobID", j, ExpireDays);
            break;
        case "l":
            l = cookiecase[1];
            SetCookie("ListID", l, ExpireDays);
            break;
        case "jb":
            jb = cookiecase[1];
            SetCookie("BatchID", jb, ExpireDays);
            break;
        case "u":
            u = cookiecase[1];
            SetCookie("UrlID", u, ExpireDays);
            break;
        case "mid":
            mid = cookiecase[1];
            SetCookie("MemberID", mid, ExpireDays);
            break;
        default:
            break;
    }
}