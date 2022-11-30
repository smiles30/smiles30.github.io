//Samantha Miles
//26 October 2022

"use strict";

var canvas;
var gl;

var axis = 0;
var xAxis = 0;
var yAxis =1;
var zAxis = 2;
var theta = [0, 0, 0];
var thetaLoc;
var flag = true;
var numElements = 29;

    var vertices = [
        vec3(-0.5, -0.5,  0.5), //V[0]
        vec3(-0.5,  0.5,  0.5), //V[1]
        vec3(0.5,  0.5,  0.5), //V[2]
        vec3(0.5, -0.5,  0.5), //V[3]
        vec3(-0.5, -0.5, -0.5), //V[4]
        vec3(-0.5,  0.5, -0.5), //V[5]
        vec3(0.5,  0.5, -0.5), //V[6]
        vec3(0.5, -0.5, -0.5) //V[7]
    ];

    var vertexColors = [
        vec4(0.0, 0.0, 0.0, 1.0),  // black
        vec4(1.0, 0.0, 0.0, 1.0),  // red
        vec4(1.0, 1.0, 0.0, 1.0),  // yellow
        vec4(0.0, 1.0, 0.0, 1.0),  // green
        vec4(0.0, 0.0, 1.0, 1.0),  // blue
        vec4(1.0, 0.0, 1.0, 1.0),  // magenta
        vec4(1.0, 1.0, 1.0, 1.0),  // white
        vec4(0.0, 1.0, 1.0, 1.0)   // cyan
    ];

// indices of the 12 triangles that compise the cube

var indices = [
    1, 0, 3, 2, 255,
    2, 3, 7, 6, 255,
    3, 0, 4, 7, 255,
    6, 5, 1, 2, 255,
    4, 5, 6, 7, 255,
    5, 4, 0, 1
];

init();

function init()
{

 //Bug: One face of cube is not properly fixed; one of 12 triangles not set right
 //Fix: 2,3,7,2,255 -> 2,3,7,6,255

 //Reduce numElements one at a time, what do you observe?
 //Removing just one element, a triangle is visible on a face of the cube
 //Removing 2 elements (n = 27), a whole face is gone
 //Removing 3, 4, 5 elements (n = 26, 25, 24), no change?
 //Removing 6 elements (n = 23), a triangle is visible on a cube face
 //Removing 7 elements (n = 22), another face is gone
 //Removing 8, 9, 10 elements (n = 21, 20, 19), no change?
 //Removing 11 elements (n = 18), another triangle is visible
 //Removing 12 elements (n = 17), another face is gone
 //Removing 13, 14, 15 elements (n = 16, 15, 14), no change?
 //Removing 16 elements (n = 13), another triangle is visible
 //Removing 17 elements (n = 12), another face is gone
 //Removing 18, 19, 20 elements (n = 11, 10, 9), no change?
 //Removing 21 elements (n = 8), another triangle is visible
 //Removing 22 elements (n = 7), another face is gone
 //Removing 23, 24, 25 elements (n = 6, 5, 4), no change?
 //Removing 26 elements (n = 3), another triangle is visible
 //Removing 27 elements (n = 2), another face is gone
 //Removing 28, 29 elements (n = 1, 0) no change?

    canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext('webgl2');
    if (!gl) alert("WebGL 2.0 isn't available");


    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.PRIMITIVE_RESTART_FIXED_INDEX);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
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

    // vertex array attribute buffer

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    var positionLoc = gl.getAttribLocation( program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc );

    thetaLoc = gl.getUniformLocation(program, "uTheta");

    //event listeners for buttons

    document.getElementById( "xButton" ).onclick = function () {
        axis = xAxis;
    };
    document.getElementById( "yButton" ).onclick = function () {
        axis = yAxis;
    };
    document.getElementById( "zButton" ).onclick = function () {
        axis = zAxis;
    };
    document.getElementById("ButtonT").onclick = function(){flag = !flag;};

    render();
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if(flag) theta[axis] += 2.0;
    gl.uniform3fv(thetaLoc, theta);

    gl.drawElements(gl.TRIANGLE_FAN, numElements, gl.UNSIGNED_BYTE, 0);
    requestAnimationFrame(render);
}