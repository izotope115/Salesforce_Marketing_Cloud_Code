//Moment
var moment = require('moment');
//Axios
const axios = require('axios').default;
//Fuel
const ET_Client = require('./lib/ET_Client');
const clientId = '{{CLIENTID}}';
const clientSecret = '{{CLIENTSECRET}}';
const stack = 's7';

const origin = 'https://{{REST}}.rest.marketingcloudapis.com/';
const authOrigin = 'https://{{AUTHV1}}.auth.marketingcloudapis.com/';
const authOriginV2 = 'https://{{AUTHV2}}.auth.marketingcloudapis.com/v2/token';
const soapOrigin = 'https://{{SOAP}}.soap.marketingcloudapis.com/';

const client = new ET_Client(clientId, clientSecret, stack, {
    origin,
    authOrigin,
    soapOrigin,
    authOptions: {
        authVersion: 2,
        accountId: '{{MID}}'
    }
});
var clearData = setInterval(function () {
    
   //get marketing cloud access token
    const clearDataExtensions = async () => {
        try {
            const resp = await axios.post(authOriginV2, {
                "grant_type": "client_credentials",
                "client_id": clientId,
                "client_secret": clientSecret
            });

            const accessToken = resp.data.access_token;
            //console.log(accessToken)
            // clear grain bids data extension
            var clearBidsData = '<?xml version="1.0" encoding="UTF-8"?>\n<s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">\n    <s:Header>\n        <a:Action s:mustUnderstand="1">Perform</a:Action>\n        <a:To s:mustUnderstand="1">' + soapOrigin + 'Service.asmx</a:To>\n        <fueloauth xmlns="http://exacttarget.com">' + accessToken + '</fueloauth>\n    </s:Header>\n    <s:Body xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">\n        <PerformRequestMsg xmlns="http://exacttarget.com/wsdl/partnerAPI" xmlns:ns2="urn:fault.partner.exacttarget.com">\n            <Action>ClearData</Action>\n            <Definitions>\n                <Definition xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="DataExtension">\n                    <CustomerKey>Grain_Bids</CustomerKey>\n                </Definition>\n            </Definitions>\n        </PerformRequestMsg>\n    </s:Body>\n</s:Envelope>';

            var config = {
                method: 'post',
                url: 'https://mcbf8s0h5zzztdqn8-zf3kc5pvb4.soap.marketingcloudapis.com/Service.asmx',
                headers: {
                    'Content-Type': 'text/xml' //use text/xml when grabbing code from postman
                },
                data: clearBidsData
            };

            axios(config)
                .then(function (response) {
                    console.log(response)
                })

            var clearQuoteData = '<?xml version="1.0" encoding="UTF-8"?>\n<s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">\n    <s:Header>\n        <a:Action s:mustUnderstand="1">Perform</a:Action>\n        <a:To s:mustUnderstand="1">' + soapOrigin + 'Service.asmx</a:To>\n        <fueloauth xmlns="http://exacttarget.com">' + accessToken + '</fueloauth>\n    </s:Header>\n    <s:Body xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">\n        <PerformRequestMsg xmlns="http://exacttarget.com/wsdl/partnerAPI" xmlns:ns2="urn:fault.partner.exacttarget.com">\n            <Action>ClearData</Action>\n            <Definitions>\n                <Definition xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="DataExtension">\n                    <CustomerKey>quote</CustomerKey>\n                </Definition>\n            </Definitions>\n        </PerformRequestMsg>\n    </s:Body>\n</s:Envelope>';

            var config = {
                method: 'post',
                url: 'https://mcbf8s0h5zzztdqn8-zf3kc5pvb4.soap.marketingcloudapis.com/Service.asmx',
                headers: {
                    'Content-Type': 'text/xml' //use text/xml when grabbing code from postman
                },
                data: clearQuoteData
            };

            axios(config)
                .then(function (response) {
                    console.log(JSON.stringify(response.data));
                })

        } catch (err) {
            // Handle Error Here
            console.error(err);
        }
    };

    clearDataExtensions();
}, 1800000);//Refresh every 30 mins in milliseconds - 1800000