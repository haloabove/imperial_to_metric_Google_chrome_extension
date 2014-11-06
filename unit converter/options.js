Array.prototype.contains = function ( needle ) {
	for (i in this) {
		if (this[i] == needle) return true;
	}
	return false;
}
function parseUri (str) {
	var	o   = parseUri.options,
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
parseUri.options = {
	strictMode: false,
	key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
	q:   {
		name:   "queryKey",
		parser: /(?:^|&)([^&=]*)=?([^&]*)/g
	},
	parser: {
		strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
		loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
	}
	
};
parseUri.options.strictMode = true;

function save_options() {
	// Get a value saved in a form.
	
	function getCheckedRadioValue(radioGroupName) {
		   var rads = document.getElementsByName(radioGroupName),
			   i;
		   for (i=0; i < rads.length; i++)
			  if (rads[i].checked)
				  return rads[i].value;
		   return undefined;
		   }
	var theValue = getCheckedRadioValue("system");
	if (!theValue){
	var status = document.getElementById('status');
						status.textContent = 'Please select one of the above and well do the rest!';
						setTimeout(function() {
						status.textContent = '';
						}, 3000);
	 return;
	 }

	// Save it using the Chrome extension storage API.
	chrome.storage.sync.set({'usrOp': theValue},  function() {
	// Update status to let user know options were saved.
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
}

//self explanatory restore options on popup acctivated based on user pref
function restore_options() {

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
		var url = tab.url;
		var res = parseUri(url);
		url = res.host;		
		chrome.storage.sync.get(["urllist"],function (obj){
			var t = obj.urllist || [];
			if (t.contains(url)) 
			{
				document.getElementById('like').checked = true;
			}
		});
	});		
}

function clear_data() {

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
}

function connEcted(){
	chrome.tabs.query({
		active: true,               // Select active tabs
		lastFocusedWindow: true     // In the current window
	}, function(array_of_Tabs) {
			// Since there can only be one active tab in one active window, 
			//  the array has only one element
			var tab = array_of_Tabs[0];
			// Example:
			var url = tab.url;
		
			var res = parseUri(url);
			url = res.host;		
			// ... do something with url variable
		chrome.storage.sync.get(["urllist"],function (obj){
		   //all my functions and code are wrapped inside here, the rest of the options      
		   //returned inside g are either primitives (booleans) and I have one object. 

			var t = obj.urllist || [];
			
			var contains = t.indexOf(url);
			
			if (contains > -1)
			{
				t.splice(contains, 1);
				chrome.storage.sync.set({'urllist': t}, function (){ 
					var status = document.getElementById('status');
					status.textContent = 'Removed from dont run list! '+ '(' + url +')';
					status.style.color = 'green';
					setTimeout(function() {
					status.textContent = '';
					}, 3000);
					
				});
			}
			else
			{
				// to b
				t.push(url); //Selector is a string
				chrome.storage.sync.set({'urllist': t}, function (){ });   
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

function openSupportPage(){

	chrome.tabs.create( { url: "http://jovcevski.mk"} );

}
//add on load restore opt. needed for seatch of prev user choices in chrome.sync.get() .So fire away!
document.addEventListener('DOMContentLoaded', restore_options());
document.addEventListener('DOMContentLoaded', function () {
	document.getElementById('save').addEventListener('click',save_options);
	document.getElementById('clrusrdat').addEventListener('click', clear_data);	
	document.getElementById('like').addEventListener('change',connEcted);
	document.getElementById('support_link').addEventListener('click', openSupportPage);
});
//test for option change
// chrome.storage.onChanged.addListener(function(changes, namespace) {
	// for (key in changes) {
	  // var storageChange = changes[key];
	  // console.log('Storage key "%s" in namespace "%s" changed. ' +
				  // 'Old value was "%s", new value is "%s".',
				  // key,
				  // namespace,
				  // storageChange.oldValue,
				  // storageChange.newValue);
	// }
// });
