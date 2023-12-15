const express = require('express')
const request = require('request')
const bodyParser = require('body-parser')
const app = express();

const myLimit = typeof(process.argv[2]) != 'undefined' ? process.argv[2] : '100kb';
console.log('Using limit: ', myLimit);

app.use(bodyParser.json({limit: myLimit}));

app.all('*', function (req, res, next) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
    res.header("Access-Control-Allow-Headers", req.header('access-control-request-headers'));

    if (req.method === 'OPTIONS') {
        // CORS Preflight
        res.send();
    } else {

        const targetURL = process.env.TARGET_URL || 'https://dev.meetingpackage.com';
        const cookie = process.env.COOKIE || 'SSESS3f7f59d2f05fdc00dbd4518951c8458e=1OqLshxNcPymlFc1_MM6u6msE30V1yv8Y3bxYzhZ4Us';
        if (!targetURL) {
            res.send(500);
            return;
        }
        request({ url: targetURL + req.url, method: req.method, json: req.body, headers: { Cookie: cookie} },
            function (error, response, body) {
                if (error) {
                    console.error('error: ' + response.statusCode)
                }
            }).pipe(res);
    }
});

app.set('port', process.env.PORT || 3001);

app.listen(app.get('port'), function () {
    console.log('Proxy server listening on port ' + app.get('port'));
});
