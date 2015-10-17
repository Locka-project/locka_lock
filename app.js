var socketIOClient = require('socket.io-client');
var sailsIOClient = require('sails.io.js');
var readline = require('readline');

/* Authentication */
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("Identifier : ", function(id) {	
	rl.question("API Key : ", function(api) {	
		rl.close();
		connectSocket(id,api)
	});
});

function connectSocket(id,api) {
	/* Connect Socket IO */
	var io = sailsIOClient(socketIOClient);
	io.sails.url = 'http://localhost:1337';
	
	io.socket.on('connect', function(){
		io.socket.on('openDoor', function(data){
		  console.log('Opening the door.');
		  console.log(data);
		});
		io.socket.on('closeDoor', function(data){
		  console.log('Closing the door...');
		  console.log(data);
		});
		io.socket.get('/api/device/subscribe/'+id, {access_token: api}, function (data) {
		  console.log(data)
		});
		io.socket.on("device", function(data){
			console.log(data);	
		});
	});
	io.socket.on('disconnect', function(){
		console.log('Disconnected...');
	});
}


