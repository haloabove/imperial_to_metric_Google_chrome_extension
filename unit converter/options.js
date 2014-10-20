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
	var likes = document.getElementById('like').checked;

	// Save it using the Chrome extension storage API.
	chrome.storage.sync.set({'usrOp': theValue, 'usrResPage': likes},  function() {
	// Update status to let user know options were saved.
		var status = document.getElementById('status');
		status.textContent = 'Options saved.';
		setTimeout(function() {
		status.textContent = '';
		}, 1750);
		
	});
	
	var def = 'url';
	 chrome.storage.sync.set({'usrURL': def},  function() {
	// Update status to let user know options were saved.
		// var status = document.getElementById('status');
		// status.textContent = 'Url added to list.';
		// setTimeout(function() {
		// status.textContent = '';`
		// }, 1750);
		
	});
	
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {'usrOp': theValue}, function(response) {	
		});
	});
}

//self explanatory restore options on popup acctivated based on user pref
function restore_options() {
	chrome.storage.sync.get("usrOp", function(items) {
		console.log(items.usrOp);
		if(items.usrOp === 'imperial'){
			document.holder.system[0].checked = true;
		}else if(items.usrOp === 'metric'){
			document.holder.system[1].checked = true;
		}
	});
	
}



// old , method , will try use port messaging 
// function setUrlToRestricted (){

	// var getpage = document.getElementById("like").checked;
	// console.log(getpage);

	 // chrome.storage.sync.set({'usrResPage': getpage},  function() {
	// Update status to let user know options were saved.
		// var status = document.getElementById('status');
		// status.textContent = 'Url added to list.';
		// setTimeout(function() {
		// status.textContent = '';`
		// }, 1750);
		
<<<<<<< HEAD
	});
<<<<<<< HEAD
<<<<<<< HEAD
	
	
=======
	
	
>>>>>>> parent of 8f465ee... finnaly , get the url
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {'usrResPage': getpage}, function(response) {	
		});
	});
=======
	// });
	
	
	// chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		// chrome.tabs.sendMessage(tabs[0].id, {'usrResPage': getpage}, function(response) {	
		// });
	// });
	
// };
// document.addEventListener('DOMContentLoaded', function () {
      
	  // document.getElementById('like').addEventListener('click',setUrlToRestricted);
>>>>>>> parent of 87850cc... Revert "finnaly , get the url"
	
// });

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> parent of 87850cc... Revert "finnaly , get the url"
// function connEcted (){
		
		// chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		  // chrome.tabs.sendMessage(tabs[0].id, {getThePageURL: "now"}, function(response) {
		  // chrome.tabs.sendMessage(tabs[0].id, {restart: "reload"});
		  
		// console.log();
		  // });
		// });
// function runTheFuckingThing (){


// }	
// document.addEventListener("click",
    // function() {
  // window.postMessage({ getThePageURL: "now"}, "*");
// }, false);
function connEcted(){
	chrome.tabs.getSelected(null, function(tab) {
		var url = tab.url;
			console.log(url);
	  chrome.tabs.sendMessage(tab.id, {savePageUrl: "now"});
	});	
		
}
		// var port = chrome.runtime.connect({name: "methodForURL"});
		// port.postMessage({getThePageURL: "now"});
		// port.onMessage.addListener(function(msg) {
		// if (msg.answer == "ok")
		// var a = port.postMessage({url:activeTabId});
		// console.log(a);
		// port.postMessage({answer: "Reload"});
  
		//}
		
		
<<<<<<< HEAD
=======
>>>>>>> parent of 8f465ee... finnaly , get the url
=======
>>>>>>> parent of 8f465ee... finnaly , get the url
=======
	
	
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {'usrResPage': getpage}, function(response) {	
		});
	});
	
};

>>>>>>> parent of 8f465ee... finnaly , get the url
=======
>>>>>>> parent of 87850cc... Revert "finnaly , get the url"
//add on load restore opt. needed for seatch of prev user choices in chrome.sync.get() .So fire away!
document.addEventListener('DOMContentLoaded', restore_options);

document.addEventListener('DOMContentLoaded', function () {
      
	  document.getElementById('save').addEventListener('click',save_options);
	
});

document.addEventListener('DOMContentLoaded', function () {
      
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
	  document.getElementById('like').addEventListener('change',connEcted);
});
=======
	  document.getElementById('like').addEventListener('click',setUrlToRestricted);
>>>>>>> parent of 8f465ee... finnaly , get the url
=======
	  document.getElementById('like').addEventListener('click',setUrlToRestricted);
>>>>>>> parent of 8f465ee... finnaly , get the url
=======
	  document.getElementById('like').addEventListener('click',setUrlToRestricted);
>>>>>>> parent of 8f465ee... finnaly , get the url
=======
	  document.getElementById('like').addEventListener('click',connEcted);
	  });
>>>>>>> parent of 87850cc... Revert "finnaly , get the url"
	
// });
//test for option change
chrome.storage.onChanged.addListener(function(changes, namespace) {
	for (key in changes) {
	  var storageChange = changes[key];
	  console.log('Storage key "%s" in namespace "%s" changed. ' +
				  'Old value was "%s", new value is "%s".',
				  key,
				  namespace,
				  storageChange.oldValue,
				  storageChange.newValue);
	}
});

//notes:
//usrQp user question check or button to restore original page layout to be created ! 
// usrOp - user option - main setting imp or met .

//TODO : 
// implemet mechanizm for enabled on this page or not , get the current tab and in the mechanizm see if the variable is set to off and if so disable the script and reload the page  


