//Fuel SDK for Interacting with Marketing Cloud API. A simple example retrieving a Data Extension and filtering criteria. 

//In Marketing Cloud create a server-server integration package to generate your Client ID and Client Secret. Be sure to set your READ/WRITE Preferences and enable integration in the Access Menu for each business unit.

//HOW TO RUN
//Create a Data Extension with the following fields: EmailAddress | FirstName and populate with data. 
//CLONE: https://github.com/salesforce-marketingcloud/FuelSDK-Node
//NPM Install
//Node NODE_Marketing_Cloud_API_Fuel-SDK_GET_DE_AND_FILTER.js

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


const deRow = client.dataExtensionRow({
    Name: 'DATA EXTENSION NAME',
    props: ['EmailAddress', 'FirstName'],
    filter: {
        leftOperand: 'FirstName',
        operator: 'equals',
        rightOperand: 'SOME VALUE'
    }
    // to return all rows, delete the filter property
});

deRow.get((err, res) => {
    if (err) {
        console.error(err.message);
    } else {
        for (const result of res.body.Results) {
            for (const property of result.Properties.Property) {
                console.log(property);
            }
        }
    }
});
