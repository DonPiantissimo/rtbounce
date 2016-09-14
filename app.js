var
	gameport = process.env.PORT || 4004,
	//io = require('socket.io'),
	express = require('express'),
	//UUID = require('node-uuid'),
	//http = require('http'),
	app = express(),
	server = http.createServer(app);

server.listen(gameport)

app.get('/', function(req,res){
res.sendfile('/index.html',{root:__dirname});
});

app.get('/*', function(req,res,next){
res.sendfile(__dirname + '/' + req.params[0]);
});
