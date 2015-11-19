var socketIOClient = require('socket.io-client');
var sailsIOClient = require('sails.io.js');
var readline = require('readline');
var five = require("johnny-five");
var board = new five.Board();


board.on("ready", function() {
  var led = new five.Led(13);
  led.blink(100);
});


/* Functions */
function loginAPI(){
	/* Authentication */
	var rl = readline.createInterface({
	  input: process.stdin,
	  output: process.stdout
	});

	rl.question('Identifier : ', function(id) {
		rl.question('Email : ', function(email) {
			rl.question('API Key : ', function(api) {
				rl.close();
				connectSocket(id,email,api)
			});
		});
	});
}

function connectSocket(id,email,api) {
	/* Connect Socket IO */
	var io = sailsIOClient(socketIOClient);
	io.sails.url = 'http://172.20.10.5:1337';

	io.socket.on('connect', function(){
		// Listening open event
		io.socket.on('openDoor', function(data){
		  console.log('Opening the door...');
		  console.log(data);
		});
		// Listening close event
		io.socket.on('closeDoor', function(data){
		  console.log('Closing the door...');
		  console.log(data);
		});
		// Subscribe my lock
		io.socket.get('/api/devices/subscribe/'+id, {access_token: api, email: email}, function (data) {
			if(data != null){
				if(data.msg != 'success') {
					console.log(data);
				}
			}
		});
		io.socket.on("device", function(data){
			console.log('--> ID : ' + data.data.name + ' state : ' + data.data.state);
		});
	});
	io.socket.on('disconnect', function(){
		console.log('Disconnected...');
	});
}

/* Main */
loginAPI();
