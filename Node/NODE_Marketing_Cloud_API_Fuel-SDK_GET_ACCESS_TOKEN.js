
//Axios
const axios = require('axios').default;

//Fuel
const ET_Client = require('./lib/ET_Client');
const clientId = '{{client_id}}';
const clientSecret = '{{client_secret}}';
const stack = 'your_stack';

const origin = 'https://{{rest}}.rest.marketingcloudapis.com/';
const authOrigin = 'https://{{auth}}.auth.marketingcloudapis.com/v2/token';
const soapOrigin = 'https://{{soap}}.soap.marketingcloudapis.com/';

const client = new ET_Client(clientId, clientSecret, stack, {
    origin,
    authOrigin,
    soapOrigin,
    authOptions: {
        authVersion: 2,
        accountId: '{{account_id}}'
    }
});

axios({
    method: 'post',
    url: authOrigin,
    headers: {
        'authorization': '',
        'Content-Type': 'application/json'
    },
    data: {
        "grant_type": "client_credentials",
        "client_id": clientId,
        "client_secret": clientSecret
    }
})
    .then((response) => {
        console.log(response)
        const data = response.data.results;

    }).catch(function (error) {
        console.log(error.toJSON());
    });
