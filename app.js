var socketIOClient = require('socket.io-client');
var sailsIOClient = require('sails.io.js');
// var readline = require('readline');

/* Authentication */
/*
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("Username : ", function(answer) {
	console.log(answer);
	
	rl.question("Password : ", function(answer) {
		console.log(answer);
		rl.close();
	});
});
*/


/* Connect Socket IO */
var io = sailsIOClient(socketIOClient);
io.sails.url = 'http://localhost:1337';

io.socket.on('connect', function(){
  io.socket.on('openDoor', function(data){
    console.log('Open the door.');
    console.log(data);
  });
  io.socket.on('closeDoor', function(data){
    console.log('Close the door.');
    console.log(data);
  });
});
io.socket.on('disconnect', function(){
  console.log('Disconnected...');
});

