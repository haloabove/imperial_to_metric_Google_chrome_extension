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
}
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

    }
//need to be put in a single function ASP !

function fromMilesToKm(match){
	var kilometers;
	kilometers = match * 1.62137;
	return kilometers.toFixed(2);
}
function fromKmtoMi(match){
	var miles;
	miles = match / 1.62137;
	return miles.toFixed(2);
}
function fromFeetToMeters(match){
	var meters;
	meters = match / 3.2808;
	return meters.toFixed(2);
}
function fromMetersToFeet(match){
	var feet;
	feet = match * 3.2808;
	return feet.toFixed(2);
}
function fromInchToCm(match){
	var cm;
	cm = match/0.39370;
	return cm.toFixed(2);
}
function fromCmToInch(match){
	var inch;
	inch = match * 0.39370;
	return inch.toFixed(2);
}
chrome.storage.sync.get("usrOp", function(items) {
		console.log(items.usrOp);
		if(items.usrOp === 'imperial'){
			var kmMatch= /(\d+(\.\d{1,2})?)\s*(km|Km|Kilometer|Kilometers|kilometers)/g;

			replaceInElement(document.body, kmMatch, function(match) {
				//var link= document.createElement('a');
				var itmReplaced = document.createElement('b');
				itmReplaced.style.cssText = 'color: rgb(24, 100, 88);background-color: #eee;';
				itmReplaced.appendChild(document.createTextNode(fromKmtoMi(match[1])+' Miles '));
				return itmReplaced;
				 console.log("changed to metric");
			});
		}else if(items.usrOp === 'metric'){
			var miMatch= /(\d+(\.\d{1,2})?)\s*(mil|mile|miles|Miles|Mile)/g;

			replaceInElement(document.body, miMatch, function(match) {
				//var link= document.createElement('a');
				var itmReplaced = document.createElement('b');
				itmReplaced.style.cssText = 'color: rgb(24, 100, 88);background-color: #eee;';
				//ne ni treba link
				//link.href= 'http://en.wikipedia.org/wiki/'+match[0];
				//link.appendChild(document.createTextNode(match[0]));
				itmReplaced.appendChild(document.createTextNode(fromMilesToKm(match[1])+' Kilometer '));
				return itmReplaced;
				console.log("changed to metric");
			});
		}
});
//listen for the options.js for any user imput (eg. save changes) 
chrome.runtime.onMessage.addListener(
  function(request, sender) {

		if (request.usrOp == "metric"){
		
			var miMatch= /(\d+(\.\d{1,2})?)\s*(mil|mile|miles|Miles|Mile)/g;

			replaceInElement(document.body, miMatch, function(match) {
				//var link= document.createElement('a');
				var itmReplaced = "";
				var itmReplaced = document.createElement('b');
				itmReplaced.style.cssText = 'color: rgb(24, 100, 88);font-size: 1.2em;background-color: #eee;';
				//ne ni treba link
				//link.href= 'http://en.wikipedia.org/wiki/'+match[0];
				//link.appendChild(document.createTextNode(match[0]));
				itmReplaced.appendChild(document.createTextNode(fromMilesToKm(match[1])+' Kilometer '));
				return itmReplaced;
				console.log("changed to metric");
			});
		}else if(request.usrOp == "imperial"){
		
		var kmMatch= /(\d+(\.\d{1,2})?)\s*(km|Km|Kilometer|kilometer|Kilometers|kilometers)/g;

			replaceInElement(document.body, kmMatch, function(match) {
				//var link= document.createElement('a');
				var itmReplaced = "";
				var itmReplaced = document.createElement('b');
				itmReplaced.style.cssText = 'color: rgb(24, 100, 88);font-size: 1.2em;background-color: #eee;';
				itmReplaced.appendChild(document.createTextNode(fromKmtoMi(match[1])+' Miles '));
				return itmReplaced;
				 console.log("changed to metric");
			});
		}
      
  });
