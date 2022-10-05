"use strict";
var gl;
var positions;
var sliderVal = 0;

init();

function init(){
    var canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext('webgl2');
if(!gl){
	alert("WebGL isn't available");
}

    //  Configure WebGL

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    //  Load shaders and initialize attribute buffers

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, 8*Math.pow(3, 6), gl.STATIC_DRAW); // Fixed with use of Key

    // Associate out shader variables with our data buffer

    var positionLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    // slider event listener

document.getElementById("slider").onchange = function(event){
	sliderVal = parseInt(event.target.value);
	render();
};

    render();
};

function divRecursive(left, right, slid){
	var sqrt3d2 = 0.87; // Fixed with use of Key
	var p1 = mix(left, right, 0.33);
	var p2 = mix(left, right, 0.67);

	if(slid==0){
		positions.push(left);
		positions.push(p1);
		positions.push(p1);
		positions.push(p2);
		positions.push(p2);
		positions.push(right);
	}else{
		var len = p2[0] - p1[0];
		var top = vec2((p1[0] + len/2), len*sqrt3d2);
		positions.push(p1);
		positions.push(top);
		positions.push(top);
		positions.push(p2);
		--slid;
		//divide the left and right
		divRecursive(left,p1,slid);
		divRecursive(p2,right,slid);
	}
}

function render() {

	positions = [];
	var l = vec2(-1.0, 0.0);
	var r = vec2(1.0, 0.0);

	divRecursive(l,r,sliderVal);

	gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(positions));
	gl.clear(gl.COLOR_BUFFER_BIT);

    // use the variable from the slider event listener to determine how many
    // points to render

    	gl.drawArrays(gl.LINES, 0, positions.length);
    	positions = [];

//line split in segments 1/3 of line; recursion
//each recursive step, "flat" third replaced w/triangle
//h = length
//0 = straight line, 1 = middle triangle, 2 = 3, 3 = 7
//len = b - a (right minus left)
//c.x = a + len
//c.y = len * sqrt(3)/2
    
    //gl.drawArrays(gl.TRIANGLES, 0, sliderVal);
}