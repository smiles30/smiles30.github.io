"use strict";
var gl;
var points;
init();

function init()
{
    var canvas = document.getElementById( "gl-canvas" );

    gl = canvas.getContext('webgl2');
    if ( !gl ) { alert( "WebGL isn't available" ); }

    points=[
    vec2( -0.95 , -0.95 ),
    vec2(  0.00 , -0.55 ),
    vec2(  0.85 , -0.85 ),
    vec2(  0.75 , -0.25 ),
    vec2(  0.25 ,  0.25 ),
    vec2( -0.35 , -0.65 ),
    vec2( -0.75 ,  0.45 ),
    vec2(  0.00 ,  0.75 ),
    vec2( -0.35 ,  0.45 )
    ];
    
    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer

    var positionLoc = gl.getAttribLocation( program, "aPosition" );
    gl.vertexAttribPointer( positionLoc , 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( positionLoc );

    render();
};

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );

    gl.drawArrays( gl.POINTS, 0, points.length ); //line 1
    gl.drawArrays( gl.LINES, 0, points.length ); //line 2
    gl.drawArrays( gl.LINE_STRIP, 0, points.length ); //line 3
    gl.drawArrays( gl.LINE_LOOP, 0, points.length ); //line 4
    gl.drawArrays( gl.TRIANGLES, 0, points.length ); //line 5
    gl.drawArrays( gl.TRIANGLE_STRIP, 0, points.length ); //line 6
    gl.drawArrays( gl.TRIANGLE_FAN, 0, points.length ); //line 7

/*
Tests and expectations/outcomes: 

1. All commented out except line 1
	- Expectations: There will be a square for each point,
	because vec4 was used instead of vec2.
	- Outcomes: Align

2. All commented out except lines 1 and 2
	- Expectations: A line will connect all of the points.
	- Outcomes: A single line connects each point in a pair,
	in the order they are added to the array. The final point,
	with no second pair, has no line.

3. All commented out except lines 1, 2, and 3
	- Expectations: All lines are connected in the order of which
	they are added to the array.
	- Outcomes: Align

4. All commented out except lines 1, 2, 3, and 4
	- Expectations: All lines are connected in the order of which
	they are added to the array, and the final point is connected
	by a line to the first point.
	- Outcomes: Align

5. All uncommented except lines 6 and 7.
	- Expectations: A triangle will be shaded in for each 3 points
	in the order they are added to the array. (3 triangles total)
	- Outcomes: Align

6. All uncommented except line 7.
	- Expectations: A triangle will be made out of every potential
	3 points in the order they are added to the array. (9 triangles
	total, go one by one, triangle = point and the next two)
	- Outcomes: Align

7. All uncommented.
	- Expectations: A triangle is made out of every 3 points in any
	order in the array.
	- Outcomes: Align

8. Only 5 and 6 commented.
	- Expectations: Since triangles are not made, TRIANGLE_FAN will
	either not work, or will make triangles out of every possible
	point anyway, meaning it will be the same as test 7.
	- Outcomes: Triangles were filled in regardless, but unlike test 7,
	there is an extra empty space which was once filled. This is
	strange as no triangle strip exists but it is acting in place of
	the triangle strip, filling in only every potential 3 in order,
	which is why there is an extra space.

9. Only 5 and 7 commented.
	- Expectations: Looking at the previous test, it can be assumed
	triangles will be made even without line 5, so there should be no
	difference between this test and test 7.
	- Outcomes: Align
*/

}