//Integration script created by: Gabe Khofri
//https://www.gabrielkhofri.com

var myInt = setInterval(function () {
//Moment
var moment = require('moment');

//Axios
const axios = require('axios').default;

//Fuel
const ET_Client = require('./lib/ET_Client');
const clientId = 'MARKETING_CLOUD_CLIENT_ID';
const clientSecret = 'MARKETING_CLOUD_CLIENT_SECRET';
const stack = 'MARKETING_CLOUD_STACK';

const origin = 'https://YOUR_REST_KEY.rest.marketingcloudapis.com/';
const authOrigin = 'https://YOUR_AUTH_KEY.auth.marketingcloudapis.com/';
const soapOrigin = 'https://YOUR_SOAP_KEY.soap.marketingcloudapis.com/';

const client = new ET_Client(clientId, clientSecret, stack, {
    origin,
    authOrigin,
    soapOrigin,
    authOptions: {
        authVersion: 2,
        accountId: 'MARKETING_CLOUD_ACCOUNT_MID'
    }
});

//Make GET request to mymove.com
//Client secret required from MY Move. Or you can substitute using any API key.

axios({
        method: 'get',
        url: 'URL_ENDPOINT',
        headers: {
            'authorization': 'API_KEY',
            'Content-Type': 'application/json'
        }
    })
    .then((response) => {

        for (let prop in response.data.leads) {
            
            //Store responses in variables otherwise you wont be able to send JSON to the data extension (parse errors)
            
            const created_at = response.data.leads[prop].created_at;
            const email = response.data.leads[prop].email;
            const first_name = response.data.leads[prop].first_name;
            const last_name = response.data.leads[prop].last_name;
            const move_date = response.data.leads[prop].move_date;
            const new_address_1 = response.data.leads[prop].new_address_1;
            const new_address_2 = response.data.leads[prop].new_address_2;
            const new_city = response.data.leads[prop].new_city;
            const new_housing_tenure = response.data.leads[prop].new_housing_tenure;
            const new_postal_code = response.data.leads[prop].new_postal_code;
            const new_postal_code_plus4 = response.data.leads[prop].new_postal_code_plus4;
            const new_state = response.data.leads[prop].new_state;
            const offer_id = response.data.leads[prop].offer_id;

            //Insert Data
            
            const deInsert = client.dataExtensionRow({
                Name: 'DATA_EXTENSION_NAME',
                props: {
                    'created_at': moment(created_at).format("dddd, MMMM Do YYYY, h:mm:ss a"), //Convert date
                    'email': email,
                    'first_name': first_name,
                    'last_name': last_name,
                    'move_date': moment(move_date).format("dddd, MMMM Do YYYY, h:mm:ss a"), //Convert date
                    'new_address_1': new_address_1,
                    'new_address_2': new_address_2,
                    'new_city': new_city,
                    'new_housing_tenure': new_housing_tenure,
                    'new_postal_code': new_postal_code,
                    'new_postal_code_plus4': new_postal_code_plus4,
                    'new_state': new_state,
                    'offer_id': offer_id
                }
            });
            
            //POST Data Extension
            
            deInsert.post((err, res) => {
                if (err) {
                    console.error(err.message, err);
                } else {
                    console.log(res)
                }
            })
        }
    }).catch(function (error) {
    console.log(error.toJSON());
});
}, 86400000); //runs every 24 hours