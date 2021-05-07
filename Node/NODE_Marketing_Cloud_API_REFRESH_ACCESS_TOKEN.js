
//Moment
var moment = require('moment');
//Axios
const axios = require('axios').default;
//MC API
const clientId = '{{clientId}}';
const clientSecret = '{{clientSecret}}';
const stack = '{{YOUR_STACK}}';
//MC API endpoints and auth
const origin = 'https://{{REST}}.rest.marketingcloudapis.com/';
// const authOrigin = 'https://{{AUTH}}.auth.marketingcloudapis.com/';
const authOriginV2 = 'https://{{V2_AUTH}}.auth.marketingcloudapis.com/v2/token';
const soapOrigin = 'https://{{SOAP}}.soap.marketingcloudapis.com/';

const application = function (data) {
    token = data.access_token;
    expires_in = data.expires_in;

    //set interval time when token expires in 18 mins
    var tokenRefresh = setInterval(function () {

        axios.post(authOriginV2, {
            "grant_type": "client_credentials",
            "client_id": clientId,
            "client_secret": clientSecret
        })
            .then(response => {
                const data = response.data;
                console.log('New token received! Restarting API call every 18 mins. Current token expires in: ' + expires_in)
                return data
            })
            .then(application)
            .catch(err => {
                console.log('Error in token interval refresh: ', err);
            })
    }, 1080000); //1080000 = 18 mins

    //application goes here
    console.log('App goes here. Use this token in your API calls: ', token)
    //application goes here
}
//on first launch get token, return data to the application, then shutdown
var app = setTimeout(function () {
    axios.post(authOriginV2, {
        "grant_type": "client_credentials",
        "client_id": clientId,
        "client_secret": clientSecret
    })
        .then(response => {
            const data = response.data;
            console.log('App started, token recieved for the first time...')
            return data
        })
        .then(application)
        .catch(err => {
            console.log('Error in first run: ', err);
        })
}, 5000);






