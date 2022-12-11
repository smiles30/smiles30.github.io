"use strict";

var canvas;
var gl;

var program;
var timeOutVar;
var startSpinTime = 30.00;
var spinTime = 0.00;
var spinVariant = 0.50;

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
    program = webglUtils.createProgramFromScripts(gl, ["vertex-shader-3d", "fragment-shader-3d"])
    gl.useProgram(program);

var positionLocation = gl.getAttribLocation(program, "a_position");

    var texcoordLocation = gl.getAttribLocation(program, "a_texcoord");

 

    // lookup uniforms

    var matrixLocation = gl.getUniformLocation(program, "u_matrix");

    var textureLocation = gl.getUniformLocation(program, "u_texture");


    // array element buffer

    var iBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(indices), gl.STATIC_DRAW);

// color array atrribute buffer

    /*var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertexColors), gl.STATIC_DRAW);

    var colorLoc = gl.getAttribLocation(program, "aColor");
    gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLoc);*/

//positions buffer

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    var positionLoc = gl.getAttribLocation(program, "a_position");
    gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

// provide texture coordinates for the rectangle.

    var texcoordBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);

    // Set Texcoords.

    setTexcoords(gl);

 

    // Create a texture.

    var texture = gl.createTexture();

    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Fill the texture with a 1x1 blue pixel.

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,

                  new Uint8Array([0, 0, 255, 255]));

    // Asynchronously load an image

    var image = new Image();

    image.src = "Dice2.jpeg";

    image.addEventListener('load', function() {

      // Now that the image has loaded make copy it to the texture.

      gl.bindTexture(gl.TEXTURE_2D, texture);

      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);

      // Check if the image is a power of 2 in both dimensions.

      if (isPowerOf2(image.width) && isPowerOf2(image.height)) {

         // Yes, it's a power of 2. Generate mips.

         gl.generateMipmap(gl.TEXTURE_2D);

      } else {

         // No, it's not a power of 2. Turn of mips and set wrapping to clamp to edge

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

   

      var fieldOfViewRadians = degToRad(60);

      var modelXRotationRadians = degToRad(0);

      var modelYRotationRadians = degToRad(0);

   

      // Get the starting time.

      var then = 0;

    // Turn on the position attribute

    gl.enableVertexAttribArray(positionLocation);

 

    // Bind the position buffer.

    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);

 

    // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)

    var size = 3;          // 3 components per iteration

    var type = gl.FLOAT;   // the data is 32bit floats

    var normalize = false; // don't normalize the data

    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position

    var offset = 0;        // start at the beginning of the buffer

    gl.vertexAttribPointer(

        positionLocation, size, type, normalize, stride, offset);

 

    // Turn on the texcoord attribute

    gl.enableVertexAttribArray(texcoordLocation);

 

    // bind the texcoord buffer.

    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);

 

    // Tell the texcoord attribute how to get data out of texcoordBuffer (ARRAY_BUFFER)

    var size = 2;          // 2 components per iteration

    var type = gl.FLOAT;   // the data is 32bit floats

    var normalize = false; // don't normalize the data

    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position

    var offset = 0;        // start at the beginning of the buffer

    gl.vertexAttribPointer(

        texcoordLocation, size, type, normalize, stride, offset);

 

    // Compute the projection matrix

    var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;

    var projectionMatrix =

        m4.perspective(fieldOfViewRadians, aspect, 1, 2000);

 

    var cameraPosition = [0, 0, 2];

    var up = [0, 1, 0];

    var target = [0, 0, 0];

 

    // Compute the camera's matrix using look at.

    var cameraMatrix = m4.lookAt(cameraPosition, target, up);

 

    // Make a view matrix from the camera matrix.

    var viewMatrix = m4.inverse(cameraMatrix);

 

    var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

 

    var matrix = m4.xRotate(viewProjectionMatrix, modelXRotationRadians);

    matrix = m4.yRotate(matrix, modelYRotationRadians);

 

    // Set the matrix.

    gl.uniformMatrix4fv(matrixLocation, false, matrix);

 

    // Tell the shader to use texture unit 0 for u_texture

    gl.uniform1i(textureLocation, 0);

 

    // Draw the geometry.

    gl.drawArrays(gl.TRIANGLES, 0, 6 * 6);

    thetaLoc = gl.getUniformLocation(program, "uTheta");

    //document.getElementById("ButtonX").onclick = function(){axis = xAxis;};
    //document.getElementById("ButtonY").onclick = function(){axis = yAxis;};
    //document.getElementById("ButtonZ").onclick = function(){axis = zAxis;};
    document.getElementById("ButtonT").onclick = function(){
	if(flag!=true){
		flag = !flag;
		theta[xAxis] = startSpinTime;
		theta[yAxis] = startSpinTime;
		theta[zAxis] = startSpinTime;
		timeOutVar = setInterval(rollDice, 100);
	}
	};

    render();
}

function render(){

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if(flag){
	//theta[axis] += 5.0;
	//alert(theta[axis]);
	//timeOutVar = setInterval(rollDice, 25);
	}

gl.uniform3fv(thetaLoc, theta);
//gl.drawArrays(gl.TRIANGLES, 0, numPositions);
gl.drawElements(gl.TRIANGLE_FAN, numElements, gl.UNSIGNED_BYTE, 0);

    requestAnimationFrame(render);
}

function rollDice(){
	spinTime += spinVariant;
	theta[axis] += (startSpinTime + spinTime);
	//theta[xAxis] += (startSpinTime - spinTime);
	//theta[yAxis] += (startSpinTime - spinTime);
	//theta[zAxis] += (startSpinTime - spinTime);
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
		alert("Spin time exceeded!");
		resetAllVars();
	}
		
}

function resetAllVars(){
	flag = !flag;
	startSpinTime = 30.00;
	spinTime = 0.00;
	spinVariant = 0.50;
	axis = xAxis;
	theta = [0,0,0];
}

/*function winningSide(){
	if(theta[xAxis] > -50 && theta[xAxis] < 50 && theta[yAxis] < 50 && theta[zAxis] < 50){
		alert("1");
	}else if(theta[xAxis] > 100 && theta[yAxis] < 50 && theta[zAxis] < 50){
		alert("6");
	}else if(theta[axis] < 50 && theta[yAxi
}*/ //6, 1 - 2, 5 - 3, 4
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