init();

function init(){
	var canvas = document.getElementById("gl-canvas");
	gl = canvas.getContext('webg12');
	if(!gl){
		alert("WebGL 2.0 isn't available");
	}

	//create points here

	//initialization

	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.clearColor(1.0, 1.0, 1.0, 1.0);

	//load shaders and initialize attribute buffers
	
	var program = initShaders(gl, "vertex-shader", "fragment-shader");
	gl.useProgram(program);

	var buffer = gl.createBuffer();
	gl.bindBuffer(g1.ARRAY_BUFFER, buffer);

	var positionLoc = gl.getAttribLocation(program, "aPosition");
	gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(positionLoc);

	render();
};

function render(){
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.drawArrays(gl.TRIANGLES, 0, numPositions);
}