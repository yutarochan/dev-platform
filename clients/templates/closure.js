(function(){

function testClass(callback,id){
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
