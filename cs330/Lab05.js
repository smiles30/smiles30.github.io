"use strict";
var gl;
var points;
init();

function init(){
    var canvas = document.getElementById("gl-canvas");

    gl = canvas.getContext('webgl2');

if(!gl){
	alert("WebGL isn't available");
}

    points=[vec2(-0.75, 0.75), vec2(0.5, 0.5), vec2(0.75, -0.75), vec2(-0.5, -0.5),
    vec2(0.75, 0.75), vec2(-0.5, 0.5), vec2(-0.75,-0.75), vec2(0.5, -0.5), vec2(0, 0)];

// Configure WebGL

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

// Load shaders and initialize attribute buffers

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

// Load data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

// Associate shader variables with data buffer

    var positionLoc = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    render();

};

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, points.length);
}