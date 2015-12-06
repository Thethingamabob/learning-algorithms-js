/**
 * @author reesington / codepen.io/reesington
 */

/**
  * Creates a null matrix if id = false or an identity matrix if id = true.
  * @param {number} rows
  * @param {number} cols
  * @param {boolean} id
  * @returns {array}
  */
function createMatrix(rows, cols, id) {
  var matrix = [];

  for (var i = 0; i < rows; ++i)
    matrix.push([]);

  for (i = 0; i < rows; ++i)
    for (var j = 0; j < cols; ++j)
      if (id && i === j) matrix[i].push(1);
      else matrix[i].push(0);

  return matrix;
}

/**
  * Adds two matrices A and B resulting in C.
  * @param {array} matrix
  * @returns {array}
  */
 function add(A, B) {
   var rowsA = A.length, colsA = A[0].length,
 			 rowsB = B.length, colsB = B[0].length;

   if (rowsA !== rowsB || colsA !== colsB) {
     console.log("ERROR: A and B are not of the same dimensions.");
 		 return; // Returns undefined.
   }

   var C = [];

   for (var i = 0; i < rowsA; ++i) {
     C.push([]);

     for (var j = 0; j < colsA; ++j)
       C[i][j] = A[i][j] + B[i][j];
   }

   return C;
 }

/**
  * Multiplies two matrices A and B resulting in C.
  * @param {array} A
	* @param {array} B
  * @returns {array}
  */
function multiply(A, B) {
 	var rowsA = A.length, colsA = A[0].length,
			rowsB = B.length, colsB = B[0].length;
			
	if (colsA !== rowsB) {
		console.log("ERROR: Columns of A not equal to rows of B.");
		return; // Returns undefined.
	}

	var C = [];

	for (var i = 0; i < rowsA; ++i) {
		C.push([]);

		for (var j = 0; j < colsB; ++j) {
			C[i][j] = 0;
					
			for (var k = 0; k < rowsB; ++k)
				C[i][j] += A[i][k] * B[k][j];
		}
	}

	return C;
}

/**
  * Matrix transposition wrapper.
  * @param {array} matrix
  * @returns {array}
  */
function transpose(matrix) {
	var rows = matrix.length,
			cols = matrix[0].length;

	if (rows === cols) return transposeSquare(matrix, rows, cols);
	else return transposeRect(matrix, rows, cols);
}

/**
  * Square matrix transposition (should be used if rows = cols)
  * @param {array} matrix
	* @param {array} rows
	* @param {array} cols
  * @returns {array}
  */
function transposeSquare(matrix, rows, cols) {
	var newMatrix = deepCopy(matrix);

	for (var i = 0; i < rows; ++i)
		for (var j = 0; j < cols; ++j)
			if (i != j) newMatrix[i][j] = matrix[j][i];

	return newMatrix;
}

/**
  * Rectangular matrix transposition
  * @param {array} matrix
	* @param {array} rows
	* @param {array} cols
  * @returns {array}
  */
function transposeRect(matrix, rows, cols) {
	var newMatrix = [];

	for (var i = 0; i < cols; ++i)
		newMatrix.push([]);

	for (i = 0; i < rows; ++i)
		for (var j = 0; j < cols; ++j)
			newMatrix[j].push(matrix[i][j]);

	return newMatrix;
}

/**
  * Deep (not shallow) copy a given array.
  * @param {array} arr
  * @returns {array}
  */
function deepCopy(array) {
	return JSON.parse(JSON.stringify(array));
}

/**
 * Use the inputs to calculate the desired output of logical AND, OR, and XOR by specifying type.
 * @param {array} inputs
 * @param {string} type
 * @returns {array}
 */
function calcDesiredOutput(inputs, type) {
	var output = 0;

	for (var i = 0; i < inputs.length - 1; ++i) {
		if (!output) output = inputs[i];

		if (type === 'or') output = output || inputs[i + 1];
		else if (type === 'and') output = output && inputs[i + 1];
		else if (type === 'xor') output = xor(output, inputs[i + 1]);
	}

	return output;
}

/**
 * Performs a logical XOR operation.
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
function xor(a, b) {
	if ((a && !b) || (!a && b)) return 1;
	else return 0;
}

/**
 * Combines inputs and weights at a dimension i to later perform a given activation function.
 * @param {array} inputs
 * @param {array} weights
 * @param {number} threshold
 * @param {string} type
 * @returns {number}
 */
function activate(inputs, weights, threshold, type) {
	var output = 0;

	for (var i = 0; i < inputs.length; ++i)
		output += inputs[i] * weights[i];

	output -= threshold;

	// Groom output according to type of applied function:
	if (type === 'step') return step(output);
	else if (type === 'sign') return sign(output);
	else if (type === 'sigmoid') return sigmoid(output);
	else if (type === 'linear') return output.toFixed(3);
}

/**
 * Performs a step function.
 * @param {number} output
 * @param {number} threshold
 * @returns {number}
 */
function step(output) {
	if (output >= 0) return 1;
	else return 0;
}

/**
 * Performs a sign function.
 * @param {number} output
 * @param {number} threshold
 * @returns {number}
 */
function sign(output) {
	if (output >= 0) return 1;
	else return -1;
}

/**
 * Performs a sigmoid function.
 * @param {number} output
 * @returns {number}
 */
function sigmoid(output) {
	return (1 / (1 + Math.pow(Math.E, -output))).toFixed(3);
}

/**
 * Calculates error by considering desired output vs actual output.
 * @param {number} desiredOutput
 * @param {number} actualOutput
 * @returns {number}
 */
function calcError(desiredOutput, actualOutput) {
	var error = desiredOutput - actualOutput;

	if (error != Math.floor(error)) error = error.toFixed(3);

	return error;
}

/**
 * Trains each weight at dimension i.
 * @param {array} inputs
 * @param {array} weights
 * @param {number} threshold
 * @param {number} learningRate
 * @param {number} error
 * @returns {array}
 */
function trainWeight(inputs, weights, threshold, learningRate, error) {
	var newWeights = [];

	for (var i = 0; i < inputs.length; ++i)
		newWeights.push(parseFloat((weights[i] + learningRate * inputs[i] * error).toFixed(3)));

	return newWeights;
}

/**
 * Returns a stepified or signified version of input matrix A.
 * All values become 0 or 1 if step is false, -1 or 1 otherwise.
 * @param {array} A
 * @param {boolean} sign
 */
function stepify(A, sign){
	var rows = A.length, cols = A[0].length;
	
	var C = [];

	for (var i = 0; i < rowsA; ++i){
		C.push([]);
		for (var j = 0; j < colsA; ++j){
			if(sign){
				if(A[i][j] < 0)
					C[i][j] = -1;
				else
					C[i][j] = 1;
			}
			else{
				if(A[i][j] <= 0)
					C[i][j] = 0;
				else
					C[i][j] = 1;
			}
		}
	}
}


/**
 * Returns true if the two arrays are the same, false otherwise.
 * @param {array} A
 * @param {array} B
 */
function compare(A, B)
{
	var rowsA = A.length, colsA = A[0].length,
		rowsB = B.length, colsB = B[0].length;

	//cannot be the same if they do not have the same # of rows or columns
	if (colsA !== colsB || rowsA !== rowsB) 
		return false;
	
	for (var i = 0; i < colsA; ++i)
		for (var j = 0; j < rowsA; ++j)
			if(A[i][j] != B[i][j])
				return false;
			
	//only true if all of the above are the same
	return true;
}

/**
 * Returns true if the given row and column are within the matrix, false otherwise.
 * @param {array} A
 * @param {number} row
 * @param {number} col
 */
function isInside(A, row, col){
	var rowLength = A.length, colLength = A[0].length;
	
	if((row < rowLength) && (col < colLength))
		return true;
	else
		return false;
}











