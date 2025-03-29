// Update the image in the lightbox container when a new image is loaded
function imageReady(imgContainer, closeButton, newImage)
{
	imgContainer.removeChild(imgContainer.childNodes[0]);
	imgContainer.insertBefore(newImage, closeButton);	
}

// Create and show a lightbox with the specified image
function createLightBox(imgSrc){	
	var main = document.getElementById('main');
	
	// Create lightbox container
	var lightbox = document.createElement('div');
	lightbox.id = "lightbox";
	
	// Create image container
	var imgContainer = document.createElement('div');
	imgContainer.id = "img-container";

	lightbox.appendChild(imgContainer);
	main.appendChild(lightbox);
	
	// Create and set up image
	var newImage = document.createElement('img');
	newImage.src = imgSrc;	
	
	// Create close button
	var closeButton = document.createElement('a');
	closeButton.href = "#";
	var closeText = document.createTextNode('Close');
	closeButton.appendChild(closeText);	
	
	// Set up close button click handler
	closeButton.onclick = function (){ 
			closeLightBox(this); return false;
		};

	// Add elements to container
	imgContainer.appendChild(newImage);
	imgContainer.appendChild(closeButton);	
	
	showLightBox();
}

// Display the lightbox
function showLightBox(){
	document.getElementById('lightbox').style.display = "block";
}

// Close the lightbox and remove it from the DOM
function closeLightBox(thisBox){	
	document.getElementById('lightbox').style.display = "none";
	document.getElementById('main').removeChild(thisBox.parentNode.parentNode);	
}