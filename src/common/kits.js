 exports.createOrderNO = ()=> {
	var now = new Date();
	var y = now.getFullYear();
	var m =now.getMonth()+1;
	m=m<10?'0'+m:m;
	var d = now.getDate();
	d=d<10?'0'+d:d;
	var h = now.getHours();
	var mm = now.getMinutes();
	var sec = now.getSeconds();
	var mis = now.getMilliseconds();

	return 'BD'+y+m+d+h+mm+sec+mis;
}
