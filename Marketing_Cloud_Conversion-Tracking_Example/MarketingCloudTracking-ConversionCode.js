/* eslint-disable */
// <!--example email click thru url: http://localhost:8888/harley/landing-page-conversion-example.html?j=2027714&sfmc_sub=151496521&l=1940_HTML&u=55981221&mid=6421787&jb=1-->
// using jquery to grab DOM elements worth reporting on. For now we get totalValue.
$(document).ready(function () {
    //disallow tracking pixel on confirmation page when theres a page refresh.
    var numberOfRrefreshes = sessionStorage.getItem('browserRefresh');

    if (numberOfRrefreshes === null) {
        numberOfRrefreshes = 0;
    }

    numberOfRrefreshes++;

    sessionStorage.setItem("browserRefresh", numberOfRrefreshes);

    var totalValue = $("#totalValue").text();

    // Lets wrap quotes around the totalValue to properly format the dataset url.
    totalValue = '"' + totalValue + '"';
    //console.log(totalValue);

    // Set the following parameters. Vasically what you want to track.
    var convid = "1";
    var displayorder = "1";
    var linkalias = "Total Purchase";
    var dataset =
        "<data amt=" + totalValue + ' unit="Dollars" accumulate="true" />';
    // For additional datasets, simply add them to the concatenation:
    // dataset=dataset+"<data amt=\"500.00\" unit=\"Dollars\" accumulate=\"true\">
    // Do not change anything below

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

    function getCookie(cookiename) {
        if (document.cookie.length > 0) {
            startC = document.cookie.indexOf(cookiename + "=");
            if (startC != -1) {
                startC += cookiename.length + 1;
                endC = document.cookie.indexOf(";", startC);
                if (endC == -1) endC = document.cookie.length;
                return unescape(document.cookie.substring(startC, endC));
            }
        }
        return null;
    }

    var jobid = getCookie("JobID");
    var emailaddr = getCookie("EmailAddr_");
    var subid = getCookie("SubscriberID");
    var listid = getCookie("ListID");
    var batchid = getCookie("BatchID");
    var urlid = getCookie("UrlID");
    var memberid = getCookie("MemberID");

    var mcTrackingUrl = 'http://'; //be sure to replace with correct MC instance!!!!!!!
    var img = $('<img id="mcImagePixel">'); //build img pixel
    img.attr(
        "src",
        '' + mcTrackingUrl + '?xml=<system><system_name>tracking</system_name><action>conversion</action><member_id>' + memberid + '</member_id><job_id>' + jobid + '</job_id><sub_id>' + subid + '</sub_id><email></email><list>' + listid + '</list><BatchID>' + batchid + '</BatchID><original_link_id>' + urlid + '</original_link_id><conversion_link_id>' + convid + '</conversion_link_id><link_alias>' + linkalias + '</link_alias><display_order>' + displayorder + '</display_order><data_set>' + dataset + '</data_set></system>').height(1).width(1);

    img.appendTo("#mcTrackingPixel");


    // Debug
    // console.log(img, "img");

    // document.write("<textarea rows=5 cols=80>");
    // document.write("<img src='");
    // document.write("http://click.exacttarget.com/conversion.aspx?xml=<system><system_name>tracking</system_name><action>conversion</action>");
    // document.write("<member_id>" + memberid + "</member_id>");
    // document.write("<job_id>" + jobid + "</job_id>");
    // if (subid == undefined) {
    //   document.write("<sub_id></sub_id>");
    // } else {
    //   document.write("<sub_id>" + subid + "</sub_id>");
    //   emailaddr = undefined;
    // }
    // if (emailaddr == undefined) {
    //   document.write("<email></email>");
    // } else {
    //   document.write("<email>" + emailaddr + "</email>");
    // }
    // document.write("<list>" + listid + "</list>");
    // document.write("<BatchID>" + batchid + "</BatchID>");
    // document.write("<original_link_id>" + urlid + "</original_link_id>");
    // document.write("<conversion_link_id>" + convid + "</conversion_link_id>");
    // document.write("<link_alias>" + linkalias + "</link_alias>");
    // document.write("<display_order>" + displayorder + "</display_order>");
    // document.write("<data_set>" + dataset + "</data_set>");
    // document.write("</system>'");
    // document.write('width="1" height="1">');
    // document.write("</textarea>");

    // console.log("data set: ", dataset, "Member ID:", memberid, "Job ID:", jobid, "link alias:", linkalias);   
    // Debug

});
