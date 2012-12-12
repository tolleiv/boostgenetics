var http = require('http');


exports.fetch = function (rfc, callback, next, obj) {
    var o = obj || {
        host:'xml.resource.org',
        port:80,
        path:'/public/rfc/xml/rfc%no%.xml'.replace(/%no%/, rfc)
    };
    var req = http.get(o, function (response) {

        response.setEncoding('utf8');
        var str = ''
        response.on('data', function (chunk) {
            str += chunk;
        });

        response.on('end', function () {
            callback(str);
        });
    });

    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
        if (next) next();
    });

    req.end();
};




