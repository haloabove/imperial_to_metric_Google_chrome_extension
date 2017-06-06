+function(){
 
  	var Converter = function(){
		this.config = {

		};

		this.init();
	};
	
	Converter.prototype.init = function(){

		this.attachevents();
		this.getData();
	};
	
	Converter.prototype.attachevents = function(){

		chrome.runtime.onMessage.addListener(
			function(request, sender,sendResponse) {
			if (request.applyScript == "restartWithScript" )
				location.reload();
		});

	};

	Converter.prototype.getData = function(){

		chrome.storage.sync.get(["usrOp","urllist"], function(items) {
			var url = window.location.host, t = items.urllist || [];
	
			if (t.indexOf(url) == -1){
				if(items.usrOp === 'imperial'){
					var kmMatch = /((\d{1,3}([,\s.']\d{3})*|\d+)([.,]\d+)?)\s*(km|Km|Kilometer|Kilometers|kilometers)\b/g;

					this.replaceInElement(document.body, kmMatch, function(match) {
						var itmReplaced = document.createElement('b'), value = match[2].replace(/[,\s.']/, "") + (match[4] !== undefined ? match[4].replace(/[,\s.']/, ".") : ".00");
						
						itmReplaced.appendChild(document.createTextNode(this.fromKmtoMi(value)+' Miles '));
						return itmReplaced;
					}.bind(this));

				}
				if(items.usrOp === 'metric'){
					
					var miMatch = /((\d{1,3}([,\s.']\d{3})*|\d+)([.,]\d+)?)\s*(mil|Mil|mile|Mile|miles|Miles)\b/g;
					this.replaceInElement(document.body, miMatch, function(match) {
						var itmReplaced = document.createElement('b'), value = match[2].replace(/[,\s.']/, "") + (match[4] !== undefined ? match[4].replace(/[,\s.']/, ".") : ".00");
						
						itmReplaced.appendChild(document.createTextNode(this.fromMilesToKm(value)+' Kilometer '));
						return itmReplaced;
					}.bind(this));
				}
			}
		}.bind(this));
	};

	Converter.prototype.replaceInElement = function(element, find, replace) {

	    for (var i= element.childNodes.length; i-->0;) {
	        var child= element.childNodes[i];
	        if (child.nodeType==1) { 
	            var tag= child.nodeName.toLowerCase();
	            if (tag!='style' && tag!='script') 
	                this.replaceInElement(child, find, replace);
	        } else if (child.nodeType==3) { 
	            this.replaceInText(child, find, replace);	
	        }
	    };
	};

	Converter.prototype.replaceInText = function (text, find, replace) {
    var match, matches = [];
	
    while (match= find.exec(text.data))
			matches.push(match);
    for (var i= matches.length; i-->0;) {
	        match= matches[i];
	        text.splitText(match.index);
	        text.nextSibling.splitText(match[0].length);
	        text.parentNode.replaceChild(replace(match), text.nextSibling);
		}
    };

    Converter.prototype.fromMilesToKm = function(match){
		var kilometers;
		kilometers = match * 1.60934;
		return kilometers.toFixed(2);
	};

	Converter.prototype.fromKmtoMi = function (match){
		var miles;
		miles = match / 1.60934;
		return miles.toFixed(2);
	};

	if(converter = {} || converter == 'undefined'  )
		converter = new Converter();
}();