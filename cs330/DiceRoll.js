"use strict";

var canvas;
var gl;

var program;

var numPositions = 36;

var positionsArray = [];
var normalsArray = [];

var vertices = [
        vec4(-0.5, -0.5,  0.5, 1.0),
        vec4(-0.5,  0.5,  0.5, 1.0),
        vec4(0.5,  0.5,  0.5, 1.0),
        vec4(0.5, -0.5,  0.5, 1.0),
        vec4(-0.5, -0.5, -0.5, 1.0),
        vec4(-0.5,  0.5, -0.5, 1.0),
        vec4(0.5,  0.5, -0.5, 1.0),
        vec4(0.5, -0.5, -0.5, 1.0)
    ];

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = xAxis;
var theta = vec3(45.0, 45.0, 45.0);

var thetaLoc;

var flag = true;

var vertexColors = [
	vec4(0.0, 0.0, 1.0, 1.0),  // blue
	vec4(0.0, 0.0, 1.0, 1.0),  // blue
	vec4(0.0, 0.0, 1.0, 1.0),  // blue
	vec4(0.0, 0.0, 1.0, 1.0),  // blue
	vec4(0.0, 0.0, 1.0, 1.0),  // blue
	vec4(0.0, 0.0, 1.0, 1.0),  // blue
	vec4(0.0, 0.0, 1.0, 1.0),  // blue
	vec4(0.0, 0.0, 1.0, 1.0)  // blue
];

init();

function quad(a, b, c, d) {

     var t1 = subtract(vertices[b], vertices[a]);
     var t2 = subtract(vertices[c], vertices[b]);
     var normal = cross(t1, t2);
     normal = vec3(normal);

     positionsArray.push(vertices[a]);
     normalsArray.push(normal);
	//texCoordsArray.push(texCoord[0]);
     positionsArray.push(vertices[b]);
     normalsArray.push(normal);
	//texCoordsArray.push(texCoord[1]);
     positionsArray.push(vertices[c]);
     normalsArray.push(normal);
	//texCoordsArray.push(texCoord[2]);
     positionsArray.push(vertices[a]);
     normalsArray.push(normal);
	//texCoordsArray.push(texCoord[3]);
     positionsArray.push(vertices[c]);
     normalsArray.push(normal);
	//texCoordsArray.push(texCoord[4]);
     positionsArray.push(vertices[d]);
     normalsArray.push(normal);
	//texCoordsArray.push(texCoord[5]);
}


function colorCube()
{
    quad(1, 0, 3, 2);
    quad(2, 3, 7, 6);
    quad(3, 0, 4, 7);
    quad(6, 5, 1, 2);
    quad(4, 5, 6, 7);
    quad(5, 4, 0, 1);
}

function init() {
    canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext('webgl2');
    if (!gl) alert( "WebGL 2.0 isn't available");

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    colorCube();

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
    gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    thetaLoc = gl.getUniformLocation(program, "uTheta");

    document.getElementById("ButtonX").onclick = function(){axis = xAxis;};
    document.getElementById("ButtonY").onclick = function(){axis = yAxis;};
    document.getElementById("ButtonZ").onclick = function(){axis = zAxis;};
    document.getElementById("ButtonT").onclick = function(){flag = !flag;};

    render();
}

function render(){

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if(flag) theta[axis] += 2.0;

gl.uniform3fv(thetaLoc, theta);
gl.drawElements(gl.TRIANGLE_FAN, numPositions, gl.UNSIGNED_BYTE, 0);

    requestAnimationFrame(render);
}

function rollDice(){
	//Randomizer for timer
		
	//Rolls randomly on z axis for half of the timer
		
	//For remainder of timer, slows to a stop
		
}