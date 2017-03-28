$(document).ready(function(){
	$.ajax({
		url: './twilioClient/sendmessage',
		method: 'post'
	}).success(function(data){
		console.log(data); 
	}).error(function(data){
		console.log('error', data);
	})
});