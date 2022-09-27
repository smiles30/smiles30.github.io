function labArray(){
var array = [];
for (var i = 0; i < 5; i++){
	var num = Math.floor(100*(Math.random()));
	array.push(num);
}
var mean = 0;
for (var i = 0; i < array.length; i++){
	mean += array[i];
}
mean /= array.length;
var greater = [];
for(var i = 0; i < array.length; i++){
	if(array[i] > mean){
		greater.push(array[i]);
	}
}

document.querySelector("#arrayOut").innerHTML = "The array is: " + array <br> + "The mean is: " + mean <br> + "Greater: " + greater;
}