const echoPostRequest = {
  url: pm.variables.get('tokenUrl'),
  method: 'POST',
  header: {
	'Content-Type': 'application/x-www-form-urlencoded',
	'Authorization': pm.variables.get('authorizationHeader'),
	'Host': pm.variables.get('hostHeader')
  },
  body: {
    mode: 'urlencoded',
	urlencoded: [
                    { key: "username", value: pm.variables.get('userName') },
                    { key: "password", value: pm.variables.get('password') },
                    { key: "scope", value: pm.variables.get('scope') },
                    { key: "grant_type", value: pm.variables.get('grantType') },
            ]
  }
};

var getToken = true;

if (!pm.globals.get('token') ||
    !pm.globals.get('expiry')) {
    console.log('Token or expiry date are missing')
} else if (pm.globals.get('expiry') <= (new Date()).getTime()) {
    console.log('Token is expired')
} else {
    getToken = false;
    console.log('Token and expiry date are all good');
}

if (getToken === true) {
    pm.sendRequest(echoPostRequest, function (err, res) {
    console.log(err ? err : res.json());
        if (err === null) {
            console.log('Saving the token and expiry date')
            var responseJson = res.json();
            pm.globals.set('token', responseJson.access_token)

            var expiryDate = new Date();
            expiryDate.setSeconds(expiryDate.getSeconds() + responseJson.expires_in);
            pm.globals.set('expiry', expiryDate.getTime());
        }
    });
}