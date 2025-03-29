// Tracks whether the user is currently drawing on the canvas
drawing = false;
// Get reference to the drawing canvas and its context
canvasObj = document.getElementById('myDrawCanvas');
draw_context = canvasObj.getContext("2d");

// Default drawing style settings
strokeCol = "black";  // Color of the stroke/outline
fillCol = "black";    // Color used for filling shapes
lineW = 1;           // Width of the drawing line

// Set canvas dimensions to match the graph size
canvasObj.width = set_width;
canvasObj.height = set_height;

// Initialize canvas drawing functionality if supported
if (canvasObj.getContext) {
	
		// Set up mouse event handlers for drawing
		canvasObj.onmousemove = draw;
		
		// Start drawing when mouse button is pressed
		canvasObj.onmousedown = startdraw;
		
		// Stop drawing when mouse button is released or mouse leaves canvas
		canvasObj.onmouseup = stopdraw;
		canvasObj.onmouseout = stopdraw;

        // Initialize drawing settings from dropdowns
        initSettings();
}

// Calculate the position of an element relative to the viewport
function findPos(obj) {
	var curleft = curtop = 0;

	if (obj.offsetParent) {
		do {
			curleft += obj.offsetLeft;
			curtop += obj.offsetTop;
		} while (obj = obj.offsetParent);
		return [curleft, curtop];
	}
}

// Convert mouse coordinates to canvas coordinates
function getMouseCoords(event)
{
	if (!event) var event = window.event;

	var posx = 0;
	var posy = 0;
	if (event.pageX || event.pageY) 	{
		posx = event.pageX;
		posy = event.pageY;
	}
	else if (event.clientX || event.clientY) 	{
		posx = event.clientX + document.body.scrollLeft
			+ document.documentElement.scrollLeft;
		posy = event.clientY + document.body.scrollTop
			+ document.documentElement.scrollTop;
	}

	var totaloffset = findPos(canvasObj);
	
	var totalXoffset = totaloffset[0];
	var totalYoffset = totaloffset[1];

	var canvasX = posx- totalXoffset;
	var canvasY = posy- totalYoffset;

	// return coordinates in an array
	return [canvasX, canvasY];
	
}	

// Handle mouse movement for drawing
function draw (e) {
	if (drawing)
	{
		var coords = getMouseCoords(e);
		
		// Draw a line from the previous position to current coordinates
		draw_context.lineTo(coords[0], coords[1]); 
	
		// Draw the line
		draw_context.stroke();
	
		// If the shift key is pressed we also fill the path
		if (e.shiftKey) 
		{
			draw_context.fill();
		}
	}
}

// Start drawing when mouse button is pressed
function startdraw(e)
{
	draw_context.strokeStyle = strokeCol
    draw_context.lineWidth = lineW;
	draw_context.fillStyle = fillCol;
	// Begin new drawing path
	drawing = true;
	
	draw_context.beginPath();

	// Get initial mouse position and move to it
	coords = getMouseCoords(e);
	
	draw_context.moveTo(coords[0], coords[1]); 
}

// Stop drawing when mouse button is released or mouse leaves canvas
function stopdraw()
{
	draw_context.closePath();
	drawing = false;
}

// Initialize drawing settings based on current dropdown selections
function initSettings(){
	var line = document.getElementById('selectLine');
	var lineVal = line.options[line.selectedIndex].value;
	swapLine(lineVal);
	
	var lineCol = document.getElementById('selectCol');	
	var lineColVal = lineCol.options[lineCol.selectedIndex].value;
	swapCol(lineColVal);
	
	var fill = document.getElementById('selectFill');	
	var fillVal = fill.options[fill.selectedIndex].value;
	swapFill(fillVal);
}

// Update stroke color
function swapCol(col) {
    strokeCol = col;
}

// Update fill color
function swapFill(col) {
    fillCol = col;
}

// Update line width
function swapLine(line) {
    lineW = line;
}

function clearDrawCanvas() {
	draw_context.clearRect(0, 0, set_width, set_height);
    graph.toast("Canvas Cleared");
}