var socketIOClient = require('socket.io-client');
var sailsIOClient = require('sails.io.js');
var readline = require('readline');
var five = require("johnny-five");
var board = new five.Board({port: "/dev/ttyATH0"});
var APIKEY = "";
var device;
var doorLed;

board.on("connect", function() {
  console.log('Board on connect');
});
board.on("ready", function() {
  console.log('Board Ready');
  var button = new five.Button(12);
  doorLed = new five.Led(13);
  button.on("release", function() {
    if (!device) { doorLed.toggle(); return; }
    if (device.state == "open") {
      openDoor();
    } else {
      closeDoor();
    }
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
          APIKEY = api;
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
      device = data.data;
			console.log('--> ID : ' + device.name + ' state : ' + device.state);
      if (device.state == "open") {
        doorLed.on();
      } else {
        doorLed.off();
      }
		});
	});
	io.socket.on('disconnect', function(){
		console.log('Socket Disconnected...');
	});
}

/* Main */
loginAPI();


function openDoor() {
  io.socket.post('/api/devices/'+device.id+'/open', {access_token: APIKEY}, function (data) {

  });
}

function closeDoor() {
  io.socket.post('/api/devices/'+device.id+'/close', {access_token: APIKEY}, function (data) {

  });
}
