var express = require('express');
// var favicon = require('serve-favicon');
var path = require('path');

var app = express();
var port = 9000;
app.set('x-powered-by', false);

// app.use(favicon(__dirname + '/public/favicon.ico'));

app.use(express.static('public'));

// app.get('/m/', function (request, response) {
// 	response.sendFile(path.join(__dirname, 'public/mobile', 'index.html'));
// });

app.get('*', function (request, response) {
	response.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, function () {
	console.log("Now Running on port" + port);
});

module.exports = app;
