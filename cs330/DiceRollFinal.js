// Programmers: Samantha Miles and Maegan Jordan
// Date: 12/12/22
/*
	This is the final code for our project, most of which was inspired
	by previous projects we have worked on in the class, but with the
	added challenge of texture mapping multiple different images onto
	different sides of one cube. We had done this previously with
	color, but not with texture mapping, and this was a new concept
	for us that came with various challenges.
*/

"use strict";

var canvas;
var gl;

var program;
var timeOutVar;
var startSpinTime = 30.00;
var spinTime = 0.00;
var spinVariant = 0.50;

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = xAxis;
var theta = [0,0,0];
var numElements = 29;

var indices = [
    1, 0, 3, 2, 255,
    2, 3, 7, 6, 255,
    3, 0, 4, 7, 255,
    6, 5, 1, 2, 255,
    4, 5, 6, 7, 255,
    5, 4, 0, 1
];

var thetaLoc;
var positionLocation;
var texcoordLocation;
var iBuffer;
var matrixLocation;
var textureLocation;
var positionBuffer;
var texcoordBuffer;
var texture;
var image;
var fieldOfViewRadians;
var modelXRotationRadians;
var modelYRotationRadians;

var flag = false; // Whether or not the die is in motion

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

    program = webglUtils.createProgramFromScripts(gl, ["vertex-shader-3d", "fragment-shader-3d"])
    gl.useProgram(program);

    // array element buffer
	// The indices array buffer is necessary for gl.drawElements

    iBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), gl.STATIC_DRAW);

positionLocation = gl.getAttribLocation(program, "a_position");
texcoordLocation = gl.getAttribLocation(program, "a_texcoord");

    matrixLocation = gl.getUniformLocation(program, "u_matrix");
    textureLocation = gl.getUniformLocation(program, "u_texture");

//positions buffer

    positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    setGeometry(gl);

// provide texture coordinates

    texcoordBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);

    // set texcoords

    setTexcoords(gl);

 

    // Create a texture.

    texture = gl.createTexture();

    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Fill the texture with a 1x1 blue pixel.
	// When texture mapping wasn't properly functioning, this helped us
	// figure out where issues might be occurring.

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,

                  new Uint8Array([0, 0, 255, 255]));

    image = new Image();
    image.src = "Dice2.jpeg"; // A single image displaying all six dice

    image.addEventListener('load', function() {

      gl.bindTexture(gl.TEXTURE_2D, texture);

      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);

      if (isPowerOf2(image.width) && isPowerOf2(image.height)) {

         gl.generateMipmap(gl.TEXTURE_2D);

      } else {

         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);

         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

      }
});

function isPowerOf2(value){
   return (value & (value - 1)) === 0;
}

function degToRad(d) {
        return d * Math.PI / 180;
      }

/* Whereas we used theta for our rotations previously, we used
modelXRotationRadians and modelYRotationRadians in our final due to
issues related to texture mapping. We had to split making the dice roll
function happen without the texture and focusing on the texture alone,
then re-integrated it and found that this method worked best.*/

      fieldOfViewRadians = degToRad(60);
      modelXRotationRadians = degToRad(0);
      modelYRotationRadians = degToRad(0);

    requestAnimationFrame(render);
}

function render(){

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.enableVertexAttribArray(positionLocation);

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    var size = 3;
    var type = gl.FLOAT;
    var normalize = false;
    var stride = 0;
    var offset = 0;

    gl.vertexAttribPointer(

        positionLocation, size, type, normalize, stride, offset);

    gl.enableVertexAttribArray(texcoordLocation);

    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);

    var size = 2;
    var type = gl.FLOAT;
    var normalize = false;
    var stride = 0;
    var offset = 0;

    gl.vertexAttribPointer(
        texcoordLocation, size, type, normalize, stride, offset);

    // Compute the projection matrix

    var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;

    var projectionMatrix =
        m4.perspective(fieldOfViewRadians, aspect, 1, 2000);

    var cameraPosition = [0, 0, 2];
    var up = [0, 1, 0];
    var target = [0, 0, 0];

    // Compute the camera's matrix

    var cameraMatrix = m4.lookAt(cameraPosition, target, up);

    // Make a view matrix

    var viewMatrix = m4.inverse(cameraMatrix);
    var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);
    var matrix = m4.xRotate(viewProjectionMatrix, modelXRotationRadians);
    matrix = m4.yRotate(matrix, modelYRotationRadians);

    gl.uniformMatrix4fv(matrixLocation, false, matrix);

    gl.uniform1i(textureLocation, 0);

    gl.drawArrays(gl.TRIANGLES, 0, 6 * 6);

    thetaLoc = gl.getUniformLocation(program, "uTheta");

// When the button is pressed, rollDice occurs

    document.getElementById("ButtonT").onclick = function(){
	if(flag!=true){
		flag = !flag;
		theta[xAxis] = startSpinTime;
		theta[yAxis] = startSpinTime;
		theta[zAxis] = startSpinTime;
		timeOutVar = setInterval(rollDice, 100);
	}
	};

gl.uniform3fv(thetaLoc, theta);
//gl.drawArrays(gl.TRIANGLES, 0, numPositions);
gl.drawElements(gl.TRIANGLE_FAN, numElements, gl.UNSIGNED_BYTE, 0);

    requestAnimationFrame(render);
}

function rollDice(){
	spinTime += spinVariant;
	modelYRotationRadians += (startSpinTime + spinTime);
        modelXRotationRadians += (startSpinTime + spinTime);
	theta[axis] += (startSpinTime + spinTime);
	//theta[xAxis] += (startSpinTime - spinTime);
	//theta[yAxis] += (startSpinTime - spinTime);
	//theta[zAxis] += (startSpinTime - spinTime);
	//alert(spinTime);

	//Randomizer

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
		
	// For remainder of timer, should slow to a stop;
	// this is one element of the code that we would
	// try to improve on in the future.

	if(spinTime >= 25.00){
		spinVariant+=1;
	}else if(spinTime >= 20.00){
		spinVariant+=0.5;
	}else if(spinTime >= 15.00){
		spinVariant+=0.25;
	}

	// Once spin time is exceeded, the die stops rolling.

	if(spinTime >= 30.0){
		clearInterval(timeOutVar);
		//alert("Spin time exceeded!");
		//winningSide();
		resetAllVars();
	}
		
}

// Reset all variables so that the die can be rolled again.

function resetAllVars(){
	flag = !flag;
	startSpinTime = 30.00;
	spinTime = 0.00;
	spinVariant = 0.50;
	axis = xAxis;
	theta = [0,0,0];
	modelYRotationRadians = degToRad(0);
        modelXRotationRadians = degToRad(0);
}

// Winning Side -> function should have emphasized which side was landed
// on more clearly; did not have the time to implement.

/*function winningSide(){
	//alert("x: " + theta[xAxis] + " y: " + theta[yAxis] + " z: " + theta[zAxis]);
	if(){
		alert("1");
	}else if(){
		alert("6");
	}else if(){
		alert("3");
	}else if(){
		alert("4");
	}else if(){
		alert("5");
	}else{
		alert("2");
	}
}*/

//Opposite sides -> 6, 1 - 2, 5 - 3, 4
//1 -> left = 5, right = 2, up = 3, down = 4, opposite = 6

function setGeometry(gl) {

    var positions = new Float32Array(

      [

      -0.5, -0.5,  -0.5,

      -0.5,  0.5,  -0.5,

       0.5, -0.5,  -0.5,

      -0.5,  0.5,  -0.5,

       0.5,  0.5,  -0.5,

       0.5, -0.5,  -0.5,

 

      -0.5, -0.5,   0.5,

       0.5, -0.5,   0.5,

      -0.5,  0.5,   0.5,

      -0.5,  0.5,   0.5,

       0.5, -0.5,   0.5,

       0.5,  0.5,   0.5,

 

      -0.5,   0.5, -0.5,

      -0.5,   0.5,  0.5,

       0.5,   0.5, -0.5,

      -0.5,   0.5,  0.5,

       0.5,   0.5,  0.5,

       0.5,   0.5, -0.5,

 

      -0.5,  -0.5, -0.5,

       0.5,  -0.5, -0.5,

      -0.5,  -0.5,  0.5,

      -0.5,  -0.5,  0.5,

       0.5,  -0.5, -0.5,

       0.5,  -0.5,  0.5,

 

      -0.5,  -0.5, -0.5,

      -0.5,  -0.5,  0.5,

      -0.5,   0.5, -0.5,

      -0.5,  -0.5,  0.5,

      -0.5,   0.5,  0.5,

      -0.5,   0.5, -0.5,

 

       0.5,  -0.5, -0.5,

       0.5,   0.5, -0.5,

       0.5,  -0.5,  0.5,

       0.5,  -0.5,  0.5,

       0.5,   0.5, -0.5,

       0.5,   0.5,  0.5,

 

      ]);

    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

  }

  // Fill the buffer with texture coordinates the cube.

  function setTexcoords(gl) {

  gl.bufferData(

      gl.ARRAY_BUFFER,

      new Float32Array(

        [

        // select the top left image

        0.10 , 0.05  ,

        0.10  , 0.47,

        0.38, 0.05 ,

        0.10  , 0.47,

        0.38, 0.47,

        0.38, 0.05 ,

        // select the top middle image

         0.38, 0.07  ,

         0.66 , 0.07  ,

         0.38, 0.48,

         0.38, 0.48,

         0.66 , 0.07  ,

         0.66 , 0.48,

        // select to top right image

         0.66 , 0.0  ,

         0.66 , 0.5,

         0.96,   0.0  ,

         0.66 , 0.5,

         0.96, 0.5,

         0.96, 0.0  ,

        // select the bottom left image

         0.11, 0.48,

         0.38, 0.48,

         0.11, 0.92  ,

         0.11, 0.92  ,

         0.38, 0.48,

         0.38, 0.92 ,

        // select the bottom middle image

        0.39, 0.5,

        0.39, 0.9 ,

        0.665 , 0.5,

        0.39, 0.9  ,

        0.665 , 0.9  ,

        0.665 , 0.5,

        // select the bottom right image

        0.66 , 0.5,

        0.95, 0.5,

        0.66, 0.9 ,

        0.66 ,0.9,

        0.95, 0.5,

        0.95, 0.9,

 

      ]),

      gl.STATIC_DRAW);

}