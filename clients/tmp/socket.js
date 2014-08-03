/*
function setup(){
   
    var host = "ws://localhost:9090/ws";
    var socket = new WebSocket(host);
    console.log("socket status: " + socket.readyState);   
    if(socket){
      socket.onopen = function(){
        console.log("connection opened");
				socket.send('get_feed');
      }
      socket.onmessage = function(msg){
       handleServerResponse(msg);
      }
      socket.onclose = function(){
        console.log("connection closed");
      }
    }else{
      console.log("invalid socket");
    }

    function handleServerResponse(txt){
				data = $.parseJSON(txt.data);	
				depthReady = true;
				console.log(data);
		}
  }
*/
(function(){

	function Socket(host,callbacks){
		var socket = new WebSocket(host);

		socket.onopen = function(){
			callbacks['onopen'];
		}

		socket.onmessage = function(msg){
		// onmessage
		}
			sayId: function(){
				console.log('saying id');
			},
		useCallback: function(){
				callback(id);
			}
		}
		return testInstance;
	}

	function randFunction(data){
		console.log('my data is '+data);
	}


var test = new testClass(randFunction,32);
test.sayId();
test.useCallback();

})(host,callback)

/*
(function(){

function testClass(callback,){
	var id=id;
	testInstance = {
		sayId: function(){
			console.log('saying id');
		},
	useCallback: function(){
			callback(id);
		}
	}
	return testInstance;
}

function randFunction(data){
	console.log('my data is '+data);
}

var test = new testClass(randFunction,32);
test.sayId();
test.useCallback();

})();

*/
