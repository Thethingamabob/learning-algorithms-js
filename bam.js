/**
 * @author reesington / codepen.io/reesington
 */

// Canvas setup:
var drawingCanvas = document.getElementById('drawing'),
		drawingContext = drawingCanvas.getContext('2d'),
		bamCanvas = document.getElementById('bam'),
		bamContext = bamCanvas.getContext('2d'),
		gridSize = 500,
		stepSize = gridSize / 5,
		drawing = [
			[-1, -1, -1, -1, -1],
		  [-1, -1, -1, -1, -1],
		  [-1, -1, -1, -1, -1],
		  [-1, -1, -1, -1, -1],
		  [-1, -1, -1, -1, -1]
		];

drawGrid(drawingContext);
drawGrid(bamContext);

var valid = false; // Validity of general execution.

// Set matrices A (input) and B (output).
		matrixA = [
			[[-1, 1, 1, 1, -1], // A
			 [-1, 1, -1, 1, -1],
			 [-1, 1, 1, 1, -1],
			 [-1, 1, -1, 1, -1],
			 [1, 1, -1, 1, 1]],

			[[-1, 1, 1, 1, -1], // B
			 [-1, 1, -1, -1, 1],
			 [-1, 1, -1, 1, -1],
			 [-1, 1, -1, -1, 1],
			 [-1, 1, 1, 1, -1]],

			[[-1, -1, -1, -1, -1], // C
			 [-1, 1, 1, 1, -1],
			 [-1, 1, -1, -1, -1],
			 [-1, 1, 1, 1, -1],
			 [-1, -1, -1, -1, -1]],

			[[-1, 1, 1, 1, -1], // D
			 [-1, 1, -1, 1, 1],
			 [-1, 1, -1, 1, 1],
			 [-1, 1, 1, 1, 1],
			 [-1, 1, 1, 1, -1]],

			[[-1, 1, 1, 1, 1], // E
			 [-1, 1, -1, -1, -1],
			 [-1, 1, 1, 1, -1],
			 [-1, 1, -1, -1, -1],
			 [-1, 1, 1, 1, 1]]
		],

		matrixB = [
			[[-1, 1, -1, 1, -1]], // A

			[[-1, 1, -1, -1, 1]], // B

			[[-1, 1, 1, 1, -1]], // C

			[[-1, 1, 1, 1, 1]], // D

			[[-1, 1, -1, -1, -1]] // E
		];

// Check that the matrices have vectors:
if (matrixA.length > 0 && matrixB.length > 0)
	valid = true;

// Check that all matrices have the same number of vectors (because they must be paired):
valid = checkMatrixLength(matrixA, matrixB);

// Check that all vectors belonging to the same set have the same length:
if (valid && checkVectorLength(matrixA) && checkVectorLength(matrixB))
	valid = true;

if (valid === true) {
	var patternPairs = matrixA.length,
			weights = createMatrix(matrixA[0].length, matrixB[0].length);

	// Calculate weight matrix:
	for (var i = 0; i < patternPairs; ++i) // For each pattern pair...
		weights = add(weights, multiply(matrixA[i], transpose(matrixB[i])));
} else {
	console.log("ERROR: Matrices were not properly inputted.");
}

// Events:
drawingCanvas.addEventListener('contextmenu', function(event) {
	event.preventDefault();
}, false);

drawingCanvas.addEventListener('mousemove', function(event) {
	event.preventDefault();

	var mouseX = Math.floor(event.pageX - $('#drawing').offset().left),
			mouseY = Math.floor(event.pageY - $('#drawing').offset().top),
			row = Math.ceil(mouseX / stepSize),
			col = Math.ceil(mouseY / stepSize);

	if (col > 5) col = 5;
	if (row > 5) row = 5;

	if (event.which === 1) drawing[col - 1][row - 1] = 1;
	else drawing[col - 1][row - 1] = -1;

	var recall = new Array(multiply(transpose(weights), drawing)[0].map(sign));

	// Get ideal matrix associated with drawing to draw on bamCanvas:
	for (i = 0; i < patternPairs; ++i) {
		if (matrixEquals(recall[0], matrixB[i][0])) {
			bamContext.clearRect(0, 0, 500, 500);
			drawGrid(bamContext);
			drawMatrix(bamContext, matrixA[i]);

			break;
		} else {
			bamContext.clearRect(0, 0, 500, 500);
			drawGrid(bamContext);
		}
	}

	redraw(drawingContext, drawing);
}, false);

// Utility functions:
function redraw(context, matrix) {
	context.clearRect(0, 0, 500, 500);
	drawGrid(context);
	drawMatrix(context, matrix);
}

function drawMatrix(context, matrix) {
	for (var i = 0; i < matrix.length; ++i) // Rows
		for (var j = 0; j < matrix[0].length; ++j) // Columns
			if (matrix[i][j] === 1)
				context.fillRect(j * stepSize, i * stepSize, j + stepSize, i + stepSize);
}

function drawGrid(context) {
	for (var i = 100; i < gridSize; i += 100) {
		context.beginPath() // Columns.
			context.moveTo(i, 0);
			context.lineTo(i, 500);
		context.closePath();

		context.stroke();

		context.beginPath() // Rows.
			context.moveTo(0, i);
			context.lineTo(500, i);
		context.closePath();

		context.stroke();
	}
}

function matrixEquals(A, B) {
	if (!checkMatrixLength(A, B)) return false;

	for (var i = 0; i < A.length; ++i)
		if (A[i] !== B[i]) return false;

	return true;
}

function checkMatrixLength(matrixA, matrixB) {
	if (matrixA.length !== matrixB.length) return false;

	return true;
}

// Returns false if not valid; true if valid
function checkVectorLength(matrix) {
	var length = matrix[0].length;

	for (var i = 1; i < matrix.length; ++i)
		if (length !== matrix[i].length) return false;

	return true;
}
