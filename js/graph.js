// Graph dimensions
set_width = 500;
set_height = 300;
	
// Sample data for the graph - days of the week with their colors
data = [
    {name:"Mon", amount:0, colour:"red"},
    {name:"Tue", amount:0, colour:"blue"},
    {name:"Wed", amount: 0, colour:"yellow"},
    {name:"Thur", amount: 0, colour:"green"},
    {name:"Fri", amount: 0, colour:"orange"},
    {name:"Sat", amount: 0, colour:"black"},
    {name:"Sun", amount: 0, colour:"brown"}
];

var graph = function() {
    // Get reference to the main canvas and its context
    canvas = document.getElementById('myCanvas');
    context = canvas.getContext("2d");

    // Graph styling constants
    borderWidth = 10;    // Width of the graph border
    fontSize = 10;       // Font size for labels
    padding = 5;         // Padding between elements
    
    percent = 0;

    // Arrays to store graph values and snapshots
    valueArray = [];
    snapArray = [];

    data = data;

    // Set canvas dimensions
    canvas.width = set_width;
    canvas.height = set_height;

    // Calculate maximum height for bars (accounting for borders and padding)
    maxHeight = canvas.height - (borderWidth*2 + (padding * 2 + (fontSize)));

    // Initialize the graph with grid lines and axes
    initGraph = function() {
        // Create grid lines
        var blockHeight = maxHeight / 10;
        context.strokeStyle = "#ccc";

        // Draw horizontal grid lines
        for (var i = 0; i <= 10; i++) {
            context.beginPath();
            context.moveTo(borderWidth, (borderWidth + padding) + (blockHeight * i));
            context.lineTo(canvas.width - borderWidth, (borderWidth + padding) + (blockHeight * i));
            context.closePath();
            context.stroke();
        }

        // Draw axes and labels
        context.strokeStyle = "#222";
        var colWidth = (set_width - (borderWidth * 2)) / data.length;

        // Draw day labels on X-axis
        for (var i = 0; i < data.length; i++) {
            context.fillText(data[i].name, (i * colWidth) + (colWidth / 2), (set_height - borderWidth + padding/2));
        }

        // Draw Y-axis
        context.moveTo(borderWidth, (set_height - borderWidth - fontSize - padding));
        context.lineTo(borderWidth, borderWidth);
        context.stroke();

        // Draw X-axis
        context.moveTo(borderWidth, (set_height - borderWidth - fontSize - padding));
        context.lineTo(set_width - borderWidth+2, (set_height - borderWidth - fontSize - padding));
        context.stroke();
    }

    // Draw the bars for each data point
    initBars = function() {        
        var colWidth = (set_width - (borderWidth * 2)) / data.length;

        for (var i = 0; i < data.length; i++) {
            // Create gradient for bar
            grad = context.createLinearGradient(0, 0, 0, maxHeight);
            grad.addColorStop(0.5, data[i].colour);
            grad.addColorStop(1, '#eee');
            
            // Apply bar styling
            context.fillStyle = grad;
            context.shadowColor = "black";
            context.shadowOffsetX = 2;
            context.shadowOffsetY = 2;
            context.shadowBlur = 5;

            // Calculate and draw bar
            var colHeight = (((maxHeight / 100) * data[i].amount));
            context.fillRect(borderWidth+1 + (colWidth * i) + 1, 
                           (set_height+1 - (colHeight + 1 + padding + fontSize * 2)), 
                           colWidth-3, colHeight-1);

            // Add border to bar
            context.strokeStyle = "#fefefe";
            context.strokeRect(borderWidth+1 + (colWidth * i) + 1, 
                             (set_height+1 - (colHeight + 1 + padding + fontSize * 2)), 
                             colWidth-3, colHeight-1);
            
            // Reset shadow
            context.shadowOffsetX = 0;
            context.shadowOffsetY = 0;
            context.shadowBlur = 0;

            // Add percentage label above bar
            context.fillStyle = "black";
            context.fillText(data[i].amount + "%", 
                           (i * colWidth) + (colWidth / 2) -3, 
                           (canvas.height - (colHeight + padding * 2 + fontSize * 2)));
        }
    }

    // Update slider value display
    updateValue = function(i) {
        return function() {
            i.innerHTML = this.value + "%";
        }
    }

    // Show the value adjustment modal
    showSliders = function() {
        var sliders = document.getElementById('sliders');
        var sliderWrap = document.getElementById('sliderWrap');

        // Create sliders if they don't exist
        if (sliders.childNodes.length == 0) {
            // Create modal title
            var newTitle = document.createElement('h2');
            var newText = document.createTextNode("Set Values");
            newTitle.appendChild(newText);
            sliders.appendChild(newTitle);

            // Create sliders for each data point
            for (var i = 0; i < data.length; i++) {
                var j = i;

                // Create label
                var newLabelSpan = document.createElement('span');
                var newLabel = document.createTextNode(data[i].name);
                newLabelSpan.appendChild(newLabel);

                // Create slider
                var newSlide = document.createElement('input');
                newSlide.type = "range";
                newSlide.id = data[i].name + "val";
                newSlide.value = data[i].amount;

                // Create value display
                var newValue = document.createElement('span');
                newValue.innerHTML = newSlide.value + "%";
                newSlide.oninput = updateValue(newValue);

                var newBreak = document.createElement('br');

                // Add elements to modal
                sliders.appendChild(newLabelSpan);
                sliders.appendChild(newSlide);
                sliders.appendChild(newValue);
                sliders.appendChild(newBreak);
            }

            // Add save button
            var saveButton = document.createElement('button');
            var saveText = document.createTextNode("Save");
            saveButton.appendChild(saveText);
            saveButton.onclick = function() {
                var values = [];
                var sliders = document.getElementById('sliders');
                var ranges = sliders.getElementsByTagName('input');
                for (var i = 0; i < data.length; i++) {
                    values[i] = ranges[i].value;
                }
                setValues(values);
                sliderWrap.style.display = "none";
            };
            sliders.appendChild(saveButton);

            // Add close button
            var closeButton = document.createElement('button');
            var closeText = document.createTextNode("Close");
            closeButton.appendChild(closeText);
            sliders.appendChild(closeButton);
            closeButton.onclick = function() {
                sliderWrap.style.display = "none";
            };
        }
        sliderWrap.style.display = "block";
    }

    // Load saved values from localStorage
    getValues = function() {
        var valueArray = [];

        try {
            valueArray = JSON.parse(localStorage.values);
        } catch (err) {
            console.log("No local data found, using defaults");
        }
        if (valueArray.length > 0) {
            for (var i = 0; i < valueArray.length; i++) {
                data[i].amount = valueArray[i].amount;
            }
        } else {
            valueArray = data;
        }
    }

    // Update graph values and save to localStorage
    setValues = function(values) {
        for (var i = 0; i < data.length; i++) {
            data[i].amount = values[i];
            valueArray.push(values[i]);
        }
        localStorage.values = JSON.stringify(data);
        clearCanvas();
        toast("Graph Values Updated");
    }

    // Show notification message
    toast = function(toast) {
        var toasty = document.getElementById('toast');
        toasty.innerHTML = toast;
        fadeout(toasty);
    }

    // Clear and redraw the graph
    clearCanvas = function() {
        context.clearRect(0, 0, set_width, set_height);
        initGraph();
        initBars();
    }

    // Create HTML element for a snapshot
    createSnap = function(snap) {
        var snapshotImage = new Image();
        snapshotImage.src = snap;

        var imageLinkContainer = document.createElement("div");
        var imageLink = document.createElement('a');
        imageLink.href = snap;
        imageLink.onclick = function() {
            createLightBox(imageLink.href);
            return false;
        };

        // Create delete button
        var delButton = document.createElement("a");
        delButton.className = "deleteButton";
        var delText = document.createTextNode("X");
        delButton.appendChild(delText);
        delButton.onclick = function() {
            removeSnap(this.parentNode);
        }

        // Assemble snapshot element
        imageLink.appendChild(snapshotImage);
        imageLinkContainer.appendChild(imageLink);
        imageLinkContainer.appendChild(delButton);

        return imageLinkContainer;
    }

    // Create a new snapshot
    snapshot = function() {
        var newCanvas = document.createElement('canvas');
        newCanvas.width = canvas.width;
        newCanvas.height = canvas.height;

        var newContext = newCanvas.getContext("2d");

        // Capture graph canvas
        var graphURL = canvas.toDataURL();
        var graphImage = new Image();
        var drawingImage = new Image();
        var snapshot;
        graphImage.src = graphURL;
        graphImage.onload = function() {
            newContext.drawImage(graphImage, 0, 0, newCanvas.width, newCanvas.height);
            
            // Capture drawing canvas
            var drawURL = canvasObj.toDataURL();
            drawingImage.src = drawURL;
            drawingImage.onload = function() {
                newContext.drawImage(drawingImage, 0, 0, newCanvas.width, newCanvas.height);
                snapshot = newCanvas.toDataURL();
                
                // Create and add snapshot to roll
                imageLinkContainer = createSnap(snapshot);
                snapArray.push(snapshot);
                localStorage.snaps = JSON.stringify(snapArray);

                // Add snapshot to roll div
                var roll = document.getElementById('roll');
                var noSnaps = document.getElementById('nosnaps');
                if (noSnaps != null) {
                    roll.removeChild(noSnaps);
                    roll.appendChild(imageLinkContainer);
                } else {
                    roll.insertBefore(imageLinkContainer, roll.childNodes[0]);
                }
                toast("Snapshot Created");
            };
        };
    }

    // Remove all snapshots
    deleteRoll = function() {
        var roll = document.getElementById('roll');
        while (roll.hasChildNodes()) {
            roll.removeChild(roll.lastChild);
        }
        localStorage.removeItem('snaps');
        
        // Show "No Snapshots" message
        var noSnaps = document.createElement('p');
        noSnaps.id = "nosnaps";
        var noSnapText = document.createTextNode("No Snapshots");
        noSnaps.appendChild(noSnapText);
        var roll = document.getElementById('roll');
        roll.appendChild(noSnaps);
        toast("All snapshots deleted");
    }

    // Load saved snapshots from localStorage
    setSnaps = function() {
        var snaps = [];
        try {
            snaps = JSON.parse(localStorage.snaps);
            for (var i = 0; i < snaps.length; i++) {
                snapArray.push(snaps[i]);
                imageLinkContainer = createSnap(snaps[i]);

                var roll = document.getElementById('roll');
                var noSnaps = document.getElementById('nosnaps');

                if (noSnaps != null) {
                    roll.removeChild(noSnaps);
                    roll.appendChild(imageLinkContainer);
                } else {
                    roll.insertBefore(imageLinkContainer, roll.childNodes[0]);
                }
            }
        } catch (err) {
            // Show "No Snapshots" message if no saved snapshots
            var noSnaps = document.createElement('p');
            noSnaps.id = "nosnaps";
            var noSnapText = document.createTextNode("No Snapshots");
            noSnaps.appendChild(noSnapText);
            var roll = document.getElementById('roll');
            roll.appendChild(noSnaps);
        }
    }

    // Remove a single snapshot
    removeSnap = function(snap) {
        // Remove from DOM
        var roll = document.getElementById('roll');
        roll.removeChild(snap);
        
        // Remove from array
        for (var i = 0; i < snapArray.length; i++) {
            if (snap.firstChild.href == snapArray[i]) {
                snapArray.splice(i, 1);
            }
        }

        // Update localStorage
        if (snapArray.length == 0) {
            localStorage.removeItem('snaps');
            setSnaps();
        } else {
            localStorage.snaps = JSON.stringify(snapArray);
        }
        toast("Snapshot Deleted");
    }

    // Initialize the graph
    init = function() {
        // Set up graph
        getValues();    
        clearCanvas();
        setSnaps();
        
        // Set up event handlers
        changeVal.onclick = showSliders;
        
        document.getElementById("selectLine").onchange = function() {
            swapLine(this.value);
        };
        document.getElementById("selectCol").onchange = function() {
            swapCol(this.value);
        };
        document.getElementById("selectFill").onchange = function() {
            swapFill(this.value);
        };
        
        document.getElementById("clearbutton").onclick = clearDrawCanvas;
        document.getElementById("snapShot").onclick = snapshot;
        document.getElementById("delRoll").onclick = deleteRoll;
    }

    return { init: init };
}()