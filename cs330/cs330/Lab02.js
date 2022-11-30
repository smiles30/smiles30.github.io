function getInfo(){
var date = new Date;
var year = date.getFullYear();

const months = ["January", "February", "March", "April", "May",
"June", "July", "August", "September", "October", "November", "December"];

var month = months[date.getMonth()];
var minute = date.getMinutes();

var day = date.getDay();

var hours12 = document.getElementById("hourFormat").selectedIndex==0 ? true: false;
var hour = date.getHours();
hour = (hours12 ? hour%12 : hour);

return [year, month, date.getDate(), hour, minute];
}

function alertFunction(){
	var arr = getInfo();
	if(arr[4] < 10){
		arr[4] = "0" + arr[4];
	}
	alert("The date today is: " + arr[1] + " " + arr[2] + ", " + arr[0] 
	+ " and the current time is: " + arr[3] + ":" + arr[4]);
}

function pageFunction(){
	var arr = getInfo();
	if(arr[4] < 10){
		arr[4] = "0" + arr[4];
	}
	document.querySelector("#countOut").innerHTML = "The date today is: " + arr[1] + " " + arr[2] + ", " + arr[0] 
	+ " and the current time is: " + arr[3] + ":" + arr[4];
}