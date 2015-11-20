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
  var button = new five.Button(2);
  button.on("hold", function() {
    console.log( "Button held" );
  });

  button.on("press", function() {
    console.log( "Button pressed" );
  });

  button.on("release", function() {
    console.log( "Button released" );
  });
});
board.on("info", function(event) {
  console.log("%s sent an 'info' message: %s", event.class, event.message);
});

/* Functions */
function loginAPI(){
	/* Authentication */
  connectSocket('ARDUINOO','contact@locka.com','mnNO5fjw+sc9veDKTPVVAj2c+XH75W091bLIE+WpxbYJOeI6VI7Xg/YmnsPZUYCA', 'http://149.12.192.138:1337');
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
