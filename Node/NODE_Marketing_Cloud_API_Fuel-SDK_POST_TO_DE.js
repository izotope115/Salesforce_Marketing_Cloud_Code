
//Fuel SDK for Interacting with Marketing Cloud API. A simple example posting to an existing Data Extension.

//In Marketing Cloud create a server-server integration package to generate your Client ID and Client Secret. Be sure to set your READ/WRITE Preferences and enable integration in the Access Menu for each business unit.

//HOW TO RUN
//Create a Data Extension with the following fields: EmailAddress | FirstName | LastName and populate with data. 
//CLONE: https://github.com/salesforce-marketingcloud/FuelSDK-Node
//NPM Install
//Node NODE_Marketing_Cloud_API_Fuel-SDK_POST_TO_DE.js

const ET_Client = require('./lib/ET_Client');

const clientId = 'CLIENT_ID';
const clientSecret = 'CLIENT SECRET';
const stack = 'YOUR MARKETING CLOUD STACK';

const origin = 'https://TENANT_SPECIFIC_ENDPOINTS.rest.marketingcloudapis.com'; //REST
const authOrigin = 'https://TENANT_SPECIFIC_ENDPOINTS.auth.marketingcloudapis.com'; //AUTH
const soapOrigin = 'https://TENANT_SPECIFIC_ENDPOINTS.soap.marketingcloudapis.com'; //SOAP

const client = new ET_Client(clientId, clientSecret, stack, {
    origin,
    authOrigin,
    soapOrigin,
    authOptions: {
        authVersion: 2,
        accountId: 'YOUR MID'
    }
});


const deInsert = client.dataExtensionRow({
    Name: 'DATA EXTENSION NAME',
    props: {
        'EmailAddress': 'test@api.com',
        'FirstName': 'test',
        'LastName': 'api'
    }

});

deInsert.post((err, res) => {
    if (err) {
        console.error(err.message, err);
    } else {
        console.log(res)

    }

});
