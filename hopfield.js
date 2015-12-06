/**
 * @author Vincent Boyd (thethingamabob) / https://github.com/Thethingamabob
 * (with plenty of stuff copied from reesington's perceptron.js file)
 */


 
// Initialize control variables with default values:
var numEpochs,
	numStates,
	numNeurons,
	matStates = [],	//m by n matrix, where m is the number of memories, and n is number of neurons.
					//each row is another state to be memorized.
	matWeights = [],//n by n, where n is number of neurons
					//weight of each state's connection to another.
					//by definition, all 0 on the diagonal
	matTest = [],	//1 x n matrix, the test value to calculate
	btnListStates = [],	//list of buttons (or text fields) to enter the memory states
	btnListTest =[],	//another list, for the test value
	
	matTestDefault = [], 	//1,-1,1
	matStatesDefault = [], 	//[1,1,1],[-1,-1,-1]
	outputNew = [],
	outputOld = [],
	nameStateTable = 'stateBtnArea',
	nameTestTable = 'testBtnArea',
	stateTableText = 'States, Neuron number:',
	testTableText = 'Test Case, Neuron number:';

// Initialize view variables:


//first do initialization function:
initialize();



// Handle sticky table header:
$('.responsive-table').floatThead();

//do stuff when numbers are changed/buttons pressed here:
$('#numberStates').change(function(){updateAll()});
$('#numberNeurons').change(function(){updateAll()});
$('#numberEpochs').change(function(){});

$('#goButton').click(function(){updateWeightMatrix();calculateOutput();});


/**
 * Creates a new list of buttons, with options to customize.
 */
function refreshBtnList(targetBtnList, targetMatrix, htmlTableName, updateFunction, cornerText, numberRows, valueMin, valueMax, valueStep){
	//remember to update the relevant numbers (states, neurons) before calling this
	//And update the relevant table afterwards
	table = '#' + htmlTableName;
	
	$(table).html('');//clear out the old list
	//targetBtnList = [];//and the list of buttons
	
	matBackup = targetMatrix.slice();//need to do this, because apparently the neurons call the update function when they are created, in addition to when they are changed.
	
	for(var i = 0; i < matBackup.length; ++i)
	{
		matBackup[i] = targetMatrix[i].slice();
	}
	
	
	
	//number of rows of buttons, automatically adds header and left columns
	for(var i = 0; i <= numberRows; ++i){
		var $newDiv = $('<tr>')
			.appendTo(table)
		
		//next, for each row:
		//will always be equal to the number of neurons
		for(var j = 0; j <= numNeurons; ++j){
			if(i == 0){		//first row
				if(j == 0){	//first column - make a sort of table header
					$('<td>')
						.text(cornerText)
						.appendTo($newDiv)
				}
				else{		//otherwise print the column number
					$('<td>')
						.text(j)
						.appendTo($newDiv)
				}
			}
			else{
				if(j == 0){	//first column - print the row number
					$('<td>')
						.text(i)
						.appendTo($newDiv)
				}
				else{
					//give each button a unique name
					var position = (j-1) + ((i-1) * numNeurons);
					var buttonID = 'btn' + htmlTableName + 'ID' + position;
					
					//for convenience, remember the original state
					//if it can be found inside the backup matrix, then use that value, default to 1 otherwise
					var positionValue = 1;



					if((j-1) < matBackup[0].length && (i-1) < matBackup.length)
						positionValue = matBackup[i-1][j-1];
					
					var $newButton = $('<td>')
						.attr('class', 'input-field col s1')
						.appendTo($newDiv)

					$('<input>')
						.attr('id', buttonID)
						.attr('type','number')
						.attr('min',valueMin)
						.attr('max',valueMax)
						.attr('step',valueStep)
						.attr('value', positionValue)
						.change(function(){updateFunction})
						.appendTo($newButton)
						
					$('<label>')
						.attr('for', buttonID)
						.attr('class','active')
						.text('')
						.appendTo($newButton)
						
					targetBtnList.push(buttonID);
				}
			}
		}
	}
	// Must reset floatThead so it adjusts to new positioning:
	$('.responsive-table').floatThead('destroy');
	$('.responsive-table').floatThead();
}

function updateAll(){
	updateStateBtnList();
	updateTestBtnList();
}

function updateStateBtnList(){
	numStates = getValue('numberStates');
	numNeurons = getValue('numberNeurons');
	
	btnListStates = [];
	refreshBtnList(btnListStates, matStates, nameStateTable, updateStateBtnList, stateTableText, numStates, -1, 1, 2);
	
	updateStateMatrix();
}

function updateTestBtnList(){
	numStates = getValue('numberStates');
	numNeurons = getValue('numberNeurons');
	
	refreshBtnList(btnListTest, matTest, nameTestTable, updateTestBtnList, testTableText, 1, -1, 1, 2);
	
	updateTestMatrix();
}
	
function updateStateMatrix(){
	matStates = [];
	for(var i = 0; i < numStates; ++i){
		matStates.push([]);
		for(var j = 0; j < numNeurons; ++j){
			if(parseInt('#' + btnListStates[(i*numStates) + j]) == 1)
				matStates[i][j] = 1;
			else
				matStates[i][j] = -1; 
		}
	}
}

function updateTestMatrix(){
	matTest = [];
	matTest.push([]);
	for(var i = 0; i < numNeurons; ++i){
		if(parseInt('#' + btnListTest[i]) == 1)
				matStates[0][i] = 1;
			else
				matStates[0][i] = -1;
	}
}
	


function updateMemoryMatrix()
{
	memoryMatrix = [];
	
	//update the values in memoryMatrix
	for(var temp = 0; temp < memoryButtonInput.length; ++temp)
	{
		var name = '#' + memoryButtonInput[temp];
		console.log(name);
		if(parseInt($(name).val(), 10) == 1)
		{
			memoryMatrix.push(1);
		}
		else
		{
			memoryMatrix.push(-1);
		}
		
		
	}
	console.log(memoryMatrix);
}


function updateWeightMatrix()
{
	weightMatrix = [];
	var size = numNeurons * numNeurons;
	
	for(var t = 0; t < size; ++t)
	{
		weightMatrix.push(0);
	}
	
	
	for(var i = 0; i < numNeurons; ++i)//for each row
	{
		for(var j = 0; j < numNeurons; ++j)//and each value in each row
		{
			if(i == j)//if row and column are same, result should be 0 (neuron does not feedback to itself)
			{
				weightMatrix[i*numNeurons + j] = 0;
			}
			else
			{
				var total = 0;
				for(var k = 0; k < numMemories; ++k)
				{
					total = total + (memoryMatrix[k*numNeurons + i] * memoryMatrix[k*numNeurons + j]);
				}
				weightMatrix[i*numNeurons + j] = total;
			}
		}	
	}
	console.log(weightMatrix);
}

function calculateOutput()
{
	outputNew = [];
	outputOld = [];
	
	newWeight = createMatrix(numNeurons,numNeurons,false);
	for(var i = 0; i < numNeurons; ++i)
	{
		for(var j = 0; j < numNeurons; j++)
		{
			newWeight[j][i] = weightMatrix[i*numNeurons+j];//just to convert between my hacky format and reese's better one.
		}
	}
	newTestArray = createMatrix(numNeurons, 1, false);
	
	for(var i = 0; i < numNeurons; i++)
	{
		newTestArray[i][0] = testArray[i];
	}
	
	console.log('Starting weight matrix:');
	console.log(weightMatrix);
	console.log('new weight matrix');
	console.log(newWeight);
	
	outputOld = createMatrix(numNeurons, 1, false);
	console.log('initial output old');
	console.log(outputOld);
	
	console.log('test array');
	console.log(newTestArray);
	
	outputNew = multiply(newWeight, newTestArray);
	console.log('initial output new');
	console.log(outputNew);
	console.log('after stepify');
	stepify(outputNew);
	console.log(outputNew);
	
	var epochCounter = 1;
	
	while((compare(outputOld, outputNew) == false) && (epochCounter < numEpochs))
	{
		outputOld = outputNew.slice();//copy the newer result into the older result's spot
		outputNew = multiply(newWeight, outputOld);//then recalculate the old result
		stepify(outputNew);
		++epochCounter;
		
		console.log(epochCounter, 'of ', numEpochs);
		console.log('after epoch');
		console.log(outputOld);
		console.log('after epoch new');
		console.log(outputNew);
	}
}



function getValue(fieldName){
	return parseInt($('#' + fieldName).val(), 10);
}

function initialize(){
	//get all default values, found inside hopfield.html
	numEpochs = getValue('numberEpochs');
	numStates = getValue('numberStates');
	numNeurons = getValue('numberNeurons');
	
	//default variables for the tables
	matStates = [];
	matStates.push([]);
	matStates.push([]);
	matStates[0][0] = 1;
	matStates[0][1] = 1;
	matStates[0][2] = 1;
	matStates[1][0] = -1;
	matStates[1][1] = -1;
	matStates[1][2] = -1;
	
	matTest = [];
	matTest.push([])
	matTest[0][0] = 1;
	matTest[0][1] = -1;
	matTest[0][2] = 1;
	
	
	
	
	refreshBtnList(btnListStates, matStates, nameStateTable, updateStateBtnList, stateTableText, numStates, -1, 1, 2);
	refreshBtnList(btnListTest, matTest, nameTestTable, updateTestBtnList, testTableText, 1, -1, 1, 2);
}



/**
 * Add control variable states at a given iteration from an array to the body of an HTML table.
 * @param {array} elements
 */
function appendToTable(elements) {
	for (var i = 0; i < elements.length; ++i) {
		tableElement = document.createElement('td');
		tableElementContent = document.createTextNode(elements[i]);
		tableElement.appendChild(tableElementContent);
		tableRow.appendChild(tableElement);
		tableBody.appendChild(tableRow);
	}	
}



