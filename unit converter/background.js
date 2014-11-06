function replaceInElement(element, find, replace) {
    // iterate over child nodes in reverse, as replacement may increase
    // length of child node list.
    for (var i= element.childNodes.length; i-->0;) {
        var child= element.childNodes[i];
        if (child.nodeType==1) { 
		// ELEMENT_NODE
            var tag= child.nodeName.toLowerCase();
            if (tag!='style' && tag!='script') 
			// special case, don't touch CDATA elements
                replaceInElement(child, find, replace);
        } else if (child.nodeType==3) { 
		// TEXT_NODE
            replaceInText(child, find, replace);	
        }
    }
};
function replaceInText(text, find, replace) {
    var match;
	
    var matches= [];
	
    while (match= find.exec(text.data))
	
		matches.push(match);
		
    for (var i= matches.length; i-->0;) {
	
        match= matches[i];
		
        text.splitText(match.index);
		
        text.nextSibling.splitText(match[0].length);
		
        text.parentNode.replaceChild(replace(match), text.nextSibling);
		
		}

    };
//need to be put in a single function ASP !

function fromMilesToKm(match){
	var kilometers;
	kilometers = match * 1.60934;
	return kilometers.toFixed(2);
};
function fromKmtoMi(match){
	var miles;
	miles = match / 1.60934;
	return miles.toFixed(2);
};
// function fromFeetToMeters(match){
	// var meters;
	// meters = match / 3.2808;
	// return meters.toFixed(2);
// };
// function fromMetersToFeet(match){
	// var feet;
	// feet = match * 3.2808;
	// return feet.toFixed(2);
// };
// function fromInchToCm(match){
	// var cm;
	// cm = match/0.39370;
	// return cm.toFixed(2);
// };
// function fromCmToInch(match){
	// var inch;
	// inch = match * 0.39370;
	// return inch.toFixed(2);
// };
chrome.storage.sync.get(["usrOp","urllist"], function(items) {
	var url = window.location.host;
	var t = items.urllist || [];
	if (t.indexOf(url) == -1){
		if(items.usrOp === 'imperial'){
			//var kmMatch= /(\d+((\.|,)\d+)?)\s*(km|Km|Kilometer|Kilometers|kilometers)\b/g;
			var kmMatch = /((\d{1,3}([,\s.']\d{3})*|\d+)([.,]\d+)?)\s*(km|Km|Kilometer|Kilometers|kilometers)\b/g;
			replaceInElement(document.body, kmMatch, function(match) {
				//var link= document.createElement('a');
				var itmReplaced = document.createElement('b');
				//itmReplaced.style.cssText = 'color: rgb(24, 100, 88);background-color: #eee;';
				var value = match[2].replace(/[,\s.']/, "") + (match[4] !== undefined ? match[4].replace(/[,\s.']/, ".") : ".00");
				itmReplaced.appendChild(document.createTextNode(fromKmtoMi(value)+' Miles '));
				return itmReplaced;
			});
		}else if(items.usrOp === 'metric'){
			//var miMatch= /(\d+((\.|,)\d+)?)\s*(mil|Mil|mile|Mile|miles|Miles)\b/g;
			var miMatch = /((\d{1,3}([,\s.']\d{3})*|\d+)([.,]\d+)?)\s*(mil|Mil|mile|Mile|miles|Miles)\b/g;
			replaceInElement(document.body, miMatch, function(match) {
				//var link= document.createElement('a');
				var itmReplaced = document.createElement('b');
				//itmReplaced.style.cssText = 'color: rgb(24, 100, 88);background-color: #eee;';	
				var value = match[2].replace(/[,\s.']/, "") + (match[4] !== undefined ? match[4].replace(/[,\s.']/, ".") : ".00");
				itmReplaced.appendChild(document.createTextNode(fromMilesToKm(value)+' Kilometer '));
				return itmReplaced;
			});
		}
	}
});
//listen for the options.js for any user imput (eg. save changes) 
chrome.runtime.onMessage.addListener(
	function(request, sender,sendResponse) {
	
	if (request.applyScript == "restartWithScript" ){
	
		location.reload();
	  }
	  else {
	  }
});