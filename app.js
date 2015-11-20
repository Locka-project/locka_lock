var socketIOClient = require('socket.io-client');
var sailsIOClient = require('sails.io.js');
var readline = require('readline');
var five = require("johnny-five");
var board = new five.Board({port: "/dev/ttyATH0"});

board.on("connect", function() {
  console.log('Board on connect');
});
board.on("ready", function() {
  console.log('Board Ready');
});
board.on("info", function(event) {
  console.log("%s sent an 'info' message: %s", event.class, event.message);
});

/* Functions */
function loginAPI(){
	/* Authentication */
  connectSocket('ARDUINOO','contact@locka.com','7k6egICQB5ALmdm+Lt1oD1Soiz89pAwWyPqTHMgg2N7B98PCkr+0z59ruaJTTiOS', 'http://172.20.10.5:1337');
  return;
	var rl = readline.createInterface({
	  input: process.stdin,
	  output: process.stdout
	});
  rl.question('Server url : ', function(ip) {
  	rl.question('Identifier : ', function(id) {
  		rl.question('Email : ', function(email) {
  			rl.question('API Key : ', function(api) {
  				rl.close();
  				connectSocket(id,email,api, ip)
  			});
  		});
  	});
  });
}

function connectSocket(id,email,api, ip) {
	/* Connect Socket IO */
	var io = sailsIOClient(socketIOClient);
	io.sails.url = ip || 'http://localhost:1337';

	io.socket.on('connect', function(){

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
      var led = new five.Led(13);
      if (data.data.state == "open") {
        led.on();
      } else {
        led.off();
      }
		});
	});
	io.socket.on('disconnect', function(){
		console.log('Socket Disconnected...');
	});
}

/* Main */
loginAPI();
