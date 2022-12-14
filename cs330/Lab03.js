"use strict";
var gl;
var points;
init();

function init(){
	var canvas = document.getElementById("gl-canvas");
	gl = canvas.getContext('webgl2');
	if(!gl){
		alert("WebGL 2.0 isn't available");
	}

	//create points here

	points = [vec2(0,0), vec2(-0.5,-0.3), vec2(0.95, -0.25), vec2(0.1, 0.75)];
	points.push(vec2(0,0.95));

	//initialization

	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.clearColor(1.0, 1.0, 1.0, 1.0);

	//load shaders and initialize attribute buffers
	
	var program = initShaders(gl, "vertex-shader", "fragment-shader");
	gl.useProgram(program);

	//load data into gpu

	var bufferId = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

	//associate shader var with data buffer

	var positionLoc = gl.getAttribLocation(program, "aPosition");
	gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(positionLoc);

	render();
};

function render(){
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.drawArrays(gl.POINTS, 0, points.length);
	//change gl.POINTS to gl.TRIANGLES, see what happens
}