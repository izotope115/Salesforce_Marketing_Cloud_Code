<script runat=server>
    Platform.Load("Core", "1");

    var url = 'https://{{AUTH_BASE_URI}}.auth.marketingcloudapis.com/v2/token';
    var contentType = 'application/json';
    var payload = '{"grant_type": "client_credentials","client_id": "{{CLIENT_ID}}","client_secret": "{{CLIENT_SECRET}}","account_id":"{{MID}}"}';

    var accessTokenResult = HTTP.Post(url, contentType, payload);
    var accessToken = Platform.Function.ParseJSON(accessTokenResult["Response"][0]).access_token;

if(accessToken !='')

{
try {
var deleteUrl = 'https://{{REST_BASE_URI}}.rest.marketingcloudapis.com/contacts/v1/contacts/actions/delete?type=listReference';
var payload1 = '{"deleteOperationType": "ContactAndAttributes","targetList": {"listType": {"listTypeID": 3},"listKey": "{{DE KEY}}"},"deleteListWhenCompleted": false,"deleteListContentsWhenCompleted": false}';

var headerNames = ["Authorization"];
var s1="Bearer ";
var headerValues = [s1.concat(accessToken)];
var result = HTTP.Post(deleteUrl, contentType, payload1, headerNames, headerValues);
}
catch (ex) {
        Write("Exception Error: " + Stringify(ex));
}
}
</script>
