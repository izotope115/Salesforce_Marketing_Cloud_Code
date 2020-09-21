<script type="javascript" runat="server">

Platform.Load("core","1.1.5");

var DE = "Contacts_To_Delete";
var logDE = "Contacts_To_Delete_Log";
var log = DataExtension.Init(logDE);

var url = 'https://auth.exacttargetapis.com/v1/requestToken';
var contentType = 'application/json';
var payload = "";
payload += '{"clientId":"CLIENT_ID_GOES_HERE",';
payload += '"clientSecret":"CLIENT_SECRET_GOES_HERE"}';

var accessTokenResult = HTTP.Post(url, contentType, payload);
var statusCode = result["StatusCode"];
var response = accessTokenResult["Response"][0];
var accessToken = Platform.Function.ParseJSON(response).accessToken;

url = "https://www.exacttargetapis.com/contacts";
url += "/v1/contacts/actions/delete?type=listReference";
var headerNames = ["Authorization"];
var headerValues = ["Bearer " + accessToken];
payload = "";
payload += '{';
payload += ' "deleteOperationType": "ContactAndAttributes",';
payload += ' "targetList": {';
payload += '   "listType": {';
payload += '     "listTypeID": 3';
payload += '   },';
payload += '   "listKey": "' + DE  + '"';
payload += ' },';
payload += ' "deleteListWhenCompleted": false,';
payload += ' "deleteListContentsWhenCompleted": true';
payload += '}';

try {

  result = HTTP.Post(url, contentType, payload, headerNames, headerValues);
  result = Stringify(result).replace(/[\n\r]/g, '');
  log.Rows.Add({"Message": "result: " + result});

} catch (e) {

  e = Stringify(e).replace(/[\n\r]/g, '')
  log.Rows.Add({"Message": "error: " + e});

}

</script>