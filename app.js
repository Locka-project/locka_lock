var socketIOClient = require('socket.io-client');
var sailsIOClient = require('sails.io.js');
var readline = require('readline');
var five = require("johnny-five");
var board = new five.Board({port: "/dev/ttyATH0"});
var APIKEY = "";
var device;
var doorLed;
var io;

board.on("connect", function() {
  console.log('Board on connect');
});
board.on("ready", function() {
  console.log('Board Ready');
  var button = new five.Button(12);
  doorLed = new five.Led(13);
  // button.on("release", function() {
  //   console.log('Door moving...');
  //   doorLed.toggle();
  //   if (!device) { return; }
  //   if (device.state == "open") {
  //     openDoor();
  //   } else {
  //     closeDoor();
  //   }
  // });
});
board.on("info", function(event) {
  console.log("%s sent an 'info' message: %s", event.class, event.message);
});

/* Functions */
function loginAPI(){
	/* Authentication */
	var rl = readline.createInterface({
	  input: process.stdin,
	  output: process.stdout
	});

  rl.question('Default conf : (y/n)', function(conf) {
    if (conf == 'y') {
      APIKEY = 'mnNO5fjw+sc9veDKTPVVAj2c+XH75W091bLIE+WpxbYJOeI6VI7Xg/YmnsPZUYCA';
      connectSocket('ARDUINOO','contact@locka.com', APIKEY, 'http://149.12.192.138:1337');
    } else {
      rl.question('Server url : (leave empty for default)', function(ip) {
        if (!ip || ip == '') {
          ip = 'http://149.12.192.138:1337';
        }
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
  });

}

function connectSocket(id,email,api, ip) {
	/* Connect Socket IO */
	io = sailsIOClient(socketIOClient);
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
  console.log('device?', device);
  console.log('Sending post to /api/devices/'+device.id+'/open');
  // io.socket.put('/api/devices/'+device.id+'/open', {access_token: APIKEY}, function (data) {
  //   console.log(data);
  // });
}

function closeDoor() {
  console.log('Sending post to /api/devices/'+device.id+'/close');
  // io.socket.put('/api/devices/'+device.id+'/close', {access_token: APIKEY}, function (data) {
  //   console.log(data);
  // });
}
