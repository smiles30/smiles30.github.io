"use strict";
var gl;
var points;

var positionsArray = [];
var colorsArray = [];
var vertexColor = vec4(0.0, 0.0, 1.0, 1.0);  // blue

window.onload = init;

function init()
{
    var canvas = document.getElementById( "gl-canvas" );

    gl = canvas.getContext('webgl2');
    if ( !gl ) { alert( "WebGL isn't available" ); }

    points=[
    vec4( -0.95 , -0.95 , 0.0 , 1.0 ),
    vec4(  0.95 , -0.95 , 0.0 , 1.0 ),
    vec4(  0.00 ,  0.95 , 0.0 , 1.0 )
    ];
    positionsArray.push(points[0]);
    colorsArray.push(vertexColor);
    positionsArray.push(points[1]);
    colorsArray.push(vertexColor);
    positionsArray.push(points[2]);
    colorsArray.push(vertexColor);
    
    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU

    // color buffer
    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW);
    var colorLoc =gl.getAttribLocation(program, "aColor");
    gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLoc);

    // positions buffer
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(positionsArray), gl.STATIC_DRAW);
    var positionLoc =gl.getAttribLocation( program, "aPosition");
    gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

    render();
};

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.TRIANGLES, 0, positionsArray.length );
}