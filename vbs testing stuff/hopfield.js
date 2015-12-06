/**
 * @author Vincent Boyd (thethingamabob) / https://github.com/Thethingamabob
 */

var buttons = ['start', 'stop', 'foo', 'bar'];
var clicks = []
var buttonList1 = [];
var numberList = [];
var count = 0;

for(var i = 0; i < buttons.length; i++){
    $('<button>')
        .attr('id', buttons[i])
        .text(buttons[i])
        .appendTo('body')
		//.data-tooltip="Test"
        .click(function(){
            btnListFunction(this.id);
        });
}


btnListFunction = function(value)
{
	clicks.push(value);
	alert(value);
	alert(clicks);
	
}

$('#learnButton').click(function()
{
	var newName = 'nameHere';
	
	var newName2 = newName.concat(count);
	count++;
	var $newdiv1 = $('<div>')
		.attr('id', newName2)
		.attr('class', 'input-field col s1')
		.appendTo('#testname')
		
	$('<input>')
		.attr('id','epoch')
		.attr('type','number')
		.attr('min','1')
		.attr('max','1000')
		.attr('step','1')
		.appendTo($newdiv1)
		
		
	$('<label>')
		.attr('for', 'epoch')
		.text('epochs')
		.appendTo($newdiv1)
		
	clicks.push(newName2);

});


$('#learnButton2').click(function()
{
	$('#testname').html('');

});