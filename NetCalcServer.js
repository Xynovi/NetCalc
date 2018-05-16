var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	connections = [],
	history = [];

server.listen(process.env.PORT || 3000, '0.0.0.0');
console.log('Server Running. . .');

app.get('/', function(req, res){
	res.sendFile(__dirname + '/NetCalcClient.html');
});

io.sockets.on('connection', function(socket){
	console.log('Socket Conected...');

	//connect
	connections.push(socket);
	console.log('Connected: %s sockets connected', connections.length);

	//disconnect
	socket.on('disconnect', function(data){
		connections.splice(connections.indexOf(socket), 1);
		console.log('Disconnected: %s sockets connected', connections.length);
	});

	// Send Message
	socket.on('send data', function(data){
		console.log('data received');
		if(history.length === 10){
			console.log('history shift');
			history.shift();
			history.push(data);
		} else {
			console.log('history push init')
			history.push(data);
		}
		updateHistory();
	});

	socket.on('new user', function(data){
		updateHistory();
	})

	function updateHistory(){
		io.sockets.emit('incoming data', {new: history});
	}

});