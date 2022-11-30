// Samantha Miles
// 5 October 2022
// Changes that were made after seeing the lab key are noted in comments; the rest was done on my own

"use strict";

var gl;

var theta = 0.0;
var thetaLoc;
var delta = 0.01; //key for reference

// All colors were adjusted to personal preference

var color = vec4(0.0, 0.0, 1.0, 1.0);
var ucolor = vec4(1.0, 0.0, 1.0, 1.0);
var icolor = vec4(0.0, 1.0, 0.0, 1.0);
var colorLoc;

var delay = 100;
var morph = true;

init();

function init(){
    var canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext('webgl2');
    if(!gl){
	alert("WebGL 2.0 isn't available");
}

    //  Configure WebGL

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    //  Load shaders and initialize attribute buffers

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    var I = [ // Had issues with formation of the I, looked at key for reference
        vec2(-0.75, 0.75),
        vec2(0.75, 0.75),
        vec2(0.75, 0.50),
	vec2(0.25, 0.50),
	vec2(0.25, -0.50),
	vec2(0.75, -0.50),
	vec2(0.75, -0.75),
	vec2(-0.75, -0.75),
	vec2(-0.75, -0.50),
	vec2(-0.25, -0.50),
	vec2(-0.25, 0.50),
	vec2(-0.75, 0.50),
	vec2(-0.75, 0.75)
    ];

    var U = [
        vec2(-0.50, 0.50),
        vec2(-0.25, 0.50),
        vec2(-0.25, -0.25),
	vec2(0.25, -0.25),
	vec2(0.25, 0.50),
	vec2(0.50, 0.50),
	vec2(0.50, 0.00),
	vec2(0.50, -0.25),
	vec2(0.50, -0.50),
	vec2(-0.50, -0.50),
	vec2(-0.50, -0.25),
	vec2(-0.50, 0.00),
    ];

    // Load the data into the GPU

    var vBufferI = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBufferI);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(I), gl.STATIC_DRAW);

    // Associate out shader variables with our data buffer

    var positionLocI = gl.getAttribLocation(program, "iPosition");
    gl.vertexAttribPointer(positionLocI, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLocI);

    var vBufferU = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBufferU);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(U), gl.STATIC_DRAW);

    var positionLocU = gl.getAttribLocation(program, "uPosition");
    gl.vertexAttribPointer(positionLocU, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLocU);

    thetaLoc = gl.getUniformLocation(program, "t");

    // define the uniform variable in the shader, aColor

	colorLoc = gl.getUniformLocation(program, "aColor");

    // button listener here, toggle rotation

	document.getElementById("morph").onclick = function(){
		morph = !(morph);
	};
// Looked to key on case 2 and 3
	window.onkeydown = function(event){
		var key = String.fromCharCode(event.keyCode);
		switch(key){
			case "1": 
				morph = !(morph);
				break;
			case "2": 
				delta /= 2.0;
				break;
			case "3": 
				delta *= 2.0;
				break;
		}
	};

    render();
};

function render()
{
    gl.clear(gl.COLOR_BUFFER_BIT);

    if(morph==true){
	theta += delta;
    }

    if((theta >= 1.0) || (theta <= 0.0)){
	delta = -delta;
    }

    gl.uniform1f(thetaLoc, theta);

    color = mix(icolor, ucolor, theta);

    gl.uniform4fv(colorLoc, color);

    gl.drawArrays(gl.LINE_LOOP, 0, 12);

    setTimeout(
        function (){requestAnimationFrame(render);}, delay
    );
}