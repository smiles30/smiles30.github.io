// Samantha Miles
// 26 October 2022

"use strict";

var canvas;
var gl;

var axis = 0;
var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var theta = 0.0;
var thetaArr = [0, 0, 0];
var thetaLoc;
var delta = 0.01;
var flag = true;
var morph = false;
var numElements = 29;

var color = vec4(0.0, 0.0, 1.0, 1.0);
var ucolor = vec4(1.0, 0.0, 1.0, 1.0);
var icolor = vec4(0.0, 1.0, 0.0, 1.0);
var colorLoc;

var I = [
        vec3(0.75, 0.75, 0.5),
        vec3(0.75, 0.50, 0.5),
	vec3(0.25, 0.50, 0.5),
	vec3(0.25, -0.50, 0.5),
	vec3(0.75, -0.50, 0.5),
	vec3(0.75, -0.75, 0.5),
	vec3(-0.75, -0.75, 0.5),
	vec3(-0.75, -0.50, 0.5),
	vec3(-0.25, -0.50, 0.5),
	vec3(-0.25, 0.50, 0.5),
	vec3(-0.75, 0.50, 0.5),
	vec3(-0.75, 0.75, 0.5),
	vec3(0.75, 0.75, -0.5),
        vec3(0.75, 0.50, -0.5),
	vec3(0.25, 0.50, -0.5),
	vec3(0.25, -0.50, -0.5),
	vec3(0.75, -0.50, -0.5),
	vec3(0.75, -0.75, -0.5),
	vec3(-0.75, -0.75, -0.5),
	vec3(-0.75, -0.50, -0.5),
	vec3(-0.25, -0.50, -0.5),
	vec3(-0.25, 0.50, -0.5),
	vec3(-0.75, 0.50, -0.5),
	vec3(-0.75, 0.75, -0.5)
    ];

    var U = [
        vec3(-0.50, 0.50, 0.5),
        vec3(-0.25, 0.50, 0.5),
        vec3(-0.25, -0.25, 0.5),
	vec3(0.25, -0.25, 0.5),
	vec3(0.25, 0.50, 0.5),
	vec3(0.50, 0.50, 0.5),
	vec3(0.50, 0.00, 0.5),
	vec3(0.50, -0.25, 0.5),
	vec3(0.50, -0.50, 0.5),
	vec3(-0.50, -0.50, 0.5),
	vec3(-0.50, -0.25, 0.5),
	vec3(-0.50, 0.00, 0.5),
	vec3(-0.50, 0.50, -0.5),
        vec3(-0.25, 0.50, -0.5),
        vec3(-0.25, -0.25, -0.5),
	vec3(0.25, -0.25, -0.5),
	vec3(0.25, 0.50, -0.5),
	vec3(0.50, 0.50, -0.5),
	vec3(0.50, 0.00, -0.5),
	vec3(0.50, -0.25, -0.5),
	vec3(0.50, -0.50, -0.5),
	vec3(-0.50, -0.50, -0.5),
	vec3(-0.50, -0.25, -0.5),
	vec3(-0.50, 0.00, -0.5)
    ];

init();

function init(){
    canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext('webgl2');
    if(!gl){
	alert("WebGL 2.0 isn't available");
}

    //  Configure WebGL

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST); //Check?

    //  Load shaders and initialize attribute buffers

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program); //Errors

    // Load the data into the GPU

    var vBufferI = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBufferI);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(I), gl.STATIC_DRAW);

    // Associate out shader variables with our data buffer

    var positionLocI = gl.getAttribLocation(program, "iPosition");
    gl.vertexAttribPointer(positionLocI, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLocI);

    var vBufferU = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBufferU);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(U), gl.STATIC_DRAW);

    var positionLocU = gl.getAttribLocation(program, "uPosition");
    gl.vertexAttribPointer(positionLocU, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLocU);

    thetaLoc = gl.getUniformLocation(program, "t");

    // define the uniform variable in the shader, aColor

	colorLoc = gl.getUniformLocation(program, "aColor");

    // button listener here, toggle rotation

    document.getElementById( "xButton" ).onclick = function () {
        axis = xAxis;
    };
    document.getElementById( "yButton" ).onclick = function () {
        axis = yAxis;
    };
    document.getElementById( "zButton" ).onclick = function () {
        axis = zAxis;
    };
    document.getElementById("tRotButton").onclick = function(){flag = !flag;};
    document.getElementById("tMorphButton").onclick = function(){
		morph = !(morph);
	};

    render();
};

function render()
{
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if(morph==true){
	theta += delta;
    }

    if((theta >= 1.0) || (theta <= 0.0)){
	delta = -delta;
    }

    //gl.uniform3f(thetaLoc, flatten(theta));

    gl.uniform1f(thetaLoc, theta);

    color = mix(icolor, ucolor, theta);

    gl.uniform4fv(colorLoc, color);

    gl.drawArrays(gl.LINE_LOOP, 0, 12);

    if(flag) thetaArr[axis] += 2.0;
    gl.uniform3fv(thetaLoc, thetaArr);

    gl.drawElements(gl.TRIANGLE_FAN, numElements, gl.UNSIGNED_BYTE, 0);
    requestAnimationFrame(render);
}