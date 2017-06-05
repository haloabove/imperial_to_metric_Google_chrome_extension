+function(){

	function ConverterOptions(){
		this.options = {
			strictMode: false,
			key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
			q  : {
				name:   "queryKey",
				parser: /(?:^|&)([^&=]*)=?([^&]*)/g
			},
			parser: {
				strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
				loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
			},
			strictMode: true
		};

		this.init();
	};
	
	ConverterOptions.prototype.init = function(){
		var self = this;

		self.attachEvents();
	};
	
	ConverterOptions.prototype.attachEvents = function(){
		var self = this; 

		document.addEventListener('DOMContentLoaded', self.restore_options());
		document.addEventListener('DOMContentLoaded', function () {
			document.getElementById('save').addEventListener('click',self.save_options);
			document.getElementById('clrusrdat').addEventListener('click', self.clear_data);	
			document.getElementById('like').addEventListener('change', self.connEcted);
			document.getElementById('support_link').addEventListener('click', self.openSupportPage);
		});
	};

	ConverterOptions.prototype.contains = function ( needle ) {
		for (i in this) {
			if (this[i] == needle) return true;
		}
		return false;
	};

	ConverterOptions.prototype.parseUri = function(str) {
		var self = this;

		var	o   = self.options,
			m   = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
			uri = {},
			i   = 14;

		while (i--) uri[o.key[i]] = m[i] || "";

		uri[o.q.name] = {};
		uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
			if ($1) uri[o.q.name][$1] = $2;
		});

		return uri;
	};

	ConverterOptions.prototype.save_options = function(){
		var self = this, theValue = self.getCheckedRadioValue("system"), status = document.getElementById('status');

		if (!theValue){
			status.textContent = 'Please select one of the above and well do the rest!';
			
			setTimeout(function() {
				status.textContent = '';
			}, 3000);
			return;
		}

		chrome.storage.sync.set({'usrOp': theValue},  function() {
			var status = document.getElementById('status');
			
			status.textContent = 'Options saved.';
			setTimeout(function() {
				status.textContent = '';
			}, 1750);
			
		});

		if (theValue === "imperial"){
			chrome.browserAction.setIcon({path:"images/mi.png"});
		}

		else if (theValue === "metric"){
			chrome.browserAction.setIcon({path:"images/km.png"});
		}
		
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			chrome.tabs.sendMessage(tabs[0].id, {'usrOp': theValue, applyScript : "restartWithScript"}, function(response) {	
			});
		});
	};

	ConverterOptions.prototype.getCheckedRadioValue =  function(radioGroupName) {
		var rads = document.getElementsByName(radioGroupName),i;

		for (i=0; i < rads.length; i++)
		  if (rads[i].checked)
			  return rads[i].value;
		return undefined;
	};
	
	ConverterOptions.prototype.restore_options = function() {
		var self = this;

		chrome.storage.sync.get("usrOp", function(items) {
			if(items.usrOp === 'imperial'){
				document.holder.system[0].checked = true;
				chrome.browserAction.setIcon({path:"images/mi.png"});
			}else if(items.usrOp === 'metric'){
				document.holder.system[1].checked = true;
				chrome.browserAction.setIcon({path:"images/km.png"});
			}
			
		});

		chrome.tabs.getSelected(null, function(tab) {
			var  url = tab.url, res = self.parseUri(url);

			url = res.host;		
			chrome.storage.sync.get(["urllist"],function (obj){
				var t = obj.urllist || [];
				if (t[self.contains(url)]) 
				{
					document.getElementById('like').checked = true;
				}
			});
		});		
	};
	
	ConverterOptions.prototype.clear_data = function() {
	    
	    chrome.storage.sync.remove(["urllist","usrOp"], function() {
	        for(var i = 0; i < key.length; i++)
	            key[i];
	    });
		
		if(document.getElementById('like').checked == true)
		document.getElementById('like').checked = false;
		document.holder.system[0].checked 		= false;
		document.holder.system[1].checked		= false;
		chrome.browserAction.setIcon({path:"images/16.png"});
		var status = document.getElementById('status');
		status.textContent = 'Options restored!';
		setTimeout(function() {
			status.textContent = '';
		}, 3000);
	};
	
	ConverterOptions.prototype.connEcted = function(){
		var self = this;

		chrome.tabs.query({
			active: true,               
			lastFocusedWindow: true
		},function(array_of_Tabs) {
			var tab = array_of_Tabs[0], url = tab.url, res = self.parseUri(url);
			
			url = res.host;		
			
			chrome.storage.sync.get(["urllist"],function (obj){
				var t = obj.urllist || [], contains = t.indexOf(url);
			
				if (contains > -1){
					t.splice(contains, 1);

					chrome.storage.sync.set({'urllist': t}, function (){ 
						var status = document.getElementById('status');
						status.textContent = 'Removed from dont run list! '+ '(' + url +')';
						status.style.color = 'green';
						setTimeout(function() {
						status.textContent = '';
						}, 3000);
					});

				}else{
					t.push(url);

					chrome.storage.sync.set({'urllist': t}, function (){});   
					var status = document.getElementById('status');

					status.textContent = 'Added to dont run list!' + '(' + url + ')';
					status.style.color = 'red';
					setTimeout(function() {
						status.textContent = '';
					}, 3000);
				}
				chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
					chrome.tabs.sendMessage(tabs[0].id, {applyScript : 'restartWithScript'}, function(response) {	
					});
				});
			});
		});
	};
	
	ConverterOptions.prototype.openSupportPage =  function(){
		chrome.tabs.create( { url: "http://jovcevski.mk/support"} );
	};

	ConverterOptions.prototype.ready = function(f){
		/in/.test(document.readyState)?setTimeout(r,9,f):f()
	};

	new ConverterOptions();
}();
