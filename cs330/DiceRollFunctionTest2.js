"use strict";

var canvas;
var gl;

var program;
var timeOutVar;
var startSpinTime = 30.00;
var spinTime = 0.00;
var spinVariant = 0.10;

var vertices = [
        vec3(-0.5, -0.5,  0.5),
        vec3(-0.5,  0.5,  0.5),
        vec3(0.5,  0.5,  0.5),
        vec3(0.5, -0.5,  0.5),
        vec3(-0.5, -0.5, -0.5),
        vec3(-0.5,  0.5, -0.5),
        vec3(0.5,  0.5, -0.5),
        vec3(0.5, -0.5, -0.5)
    ];

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = xAxis;
var theta = [0,0,0];
var numElements = 29;

var thetaLoc;

var flag = false;

var vertexColors = [
	vec4(0.0, 0.0, 0.0, 1.0), //black
	vec4(0.0, 0.0, 0.0, 1.0), //black
	vec4(1.0, 0.0, 0.0, 1.0), //red
	vec4(1.0, 0.0, 0.0, 1.0), //red
	vec4(0.0, 1.0, 0.0, 1.0), //green
	vec4(0.0, 1.0, 0.0, 1.0), //green
	vec4(0.0, 1.0, 1.0, 1.0), //cyan
	vec4(0.0, 1.0, 1.0, 1.0) //cyan
];

var indices = [
    1, 0, 3, 2, 255,
    2, 3, 7, 6, 255,
    3, 0, 4, 7, 255,
    6, 5, 1, 2, 255,
    4, 5, 6, 7, 255,
    5, 4, 0, 1
];

init();

function init() {
    canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext('webgl2');
    if (!gl) alert( "WebGL 2.0 isn't available");

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);
    //gl.enable(gl.PRIMITIVE_RESTART_FIXED_INDEX);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // array element buffer

    var iBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), gl.STATIC_DRAW);

// color array atrribute buffer

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertexColors), gl.STATIC_DRAW);

    var colorLoc = gl.getAttribLocation(program, "aColor");
    gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLoc);

//positions buffer

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    var positionLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    thetaLoc = gl.getUniformLocation(program, "uTheta");

    document.getElementById("ButtonX").onclick = function(){axis = xAxis;};
    document.getElementById("ButtonY").onclick = function(){axis = yAxis;};
    document.getElementById("ButtonZ").onclick = function(){axis = zAxis;};
    document.getElementById("ButtonT").onclick = function(){
	if(flag!=true){
		flag = !flag;
		theta[xAxis] = startSpinTime;
		theta[yAxis] = startSpinTime;
		theta[zAxis] = startSpinTime;
		timeOutVar = setInterval(rollDice, 1000);
	}
	};

    render();
}

function render(){

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if(flag){
	//theta[axis] += 5.0;
	//alert(theta[axis]);
	//timeOutVar = setInterval(rollDice, 100);
	}

gl.uniform3fv(thetaLoc, theta);
//gl.drawArrays(gl.TRIANGLES, 0, numPositions);
gl.drawElements(gl.TRIANGLE_FAN, numElements, gl.UNSIGNED_BYTE, 0);

    requestAnimationFrame(render);
}

function rollDice(){
	spinTime += spinVariant;
	theta[xAxis] += (startSpinTime - spinTime);
	theta[yAxis] += (startSpinTime - spinTime);
	theta[zAxis] += (startSpinTime - spinTime);
	//alert(spinTime);
	//Randomizer for timer
	var randAxis = Math.floor(Math.random() * 3);
	switch(randAxis){
		case 0:
			axis = xAxis;
			break;
		case 1:
			axis = yAxis;
			break;
		default:
			axis = zAxis;
	}
	//Rolls randomly on z axis for half of the timer
		
	//For remainder of timer, slows to a stop

	if(spinTime >= 25.00){
		spinVariant+=1;
	}else if(spinTime >= 20.00){
		spinVariant+=0.5;
	}else if(spinTime >= 15.00){
		spinVariant+=0.25;
	}

	if(spinTime >= 30.0){
		clearInterval(timeOutVar);
		flag = !flag;
		alert("Spin time exceeded!");
	}
		
}