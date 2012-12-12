/**
 * Module dependencies.
 */

var express = require('express')
    , io = require('socket.io')
    , routes = require('./routes')
    , http = require('http')
    , path = require('path')
    , server, sio;

var train = require('./train.js');

var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.set('view options', { pretty:true });
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function () {
    app.use(express.errorHandler());
});
app.get('/', routes.index);

server = http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});

sio = io.listen(server);
sio.sockets.on('connection', function (socket) {
    socket.on('train', function (data) {
        console.log(data)
        train.train(data,function(o) {
            socket.emit('vector', o);
        });
    });
    socket.on('test', function (data) {
        train.test(data,function(o) {
            socket.emit('vector', o);
        });
    });
});
