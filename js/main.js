// Fade out effect for notifications
// Source: http://epicmargorp.blogspot.ie/2013/12/pure-javascript-fade-effect.html
var fadeout = function(elem) {
    var o = 1;  // Start with full opacity
    var timer = setInterval(function () {
        if (o <= 0.0) {
            clearInterval(timer);  // Stop when fully transparent
        }
        elem.style.opacity = o;
        elem.style.filter = 'alpha(opacity=' + o * 100 + ")";  // For IE support
        o -= 0.1;  // Decrease opacity by 10% each step
    }, 100);  // Update every 100ms
};

// Initialize the graph and drawing settings
graph.init();
initSettings();
