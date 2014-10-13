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
	chrome.storage.sync.set({'usrOp': theValue, 'usrQt': likes},  function() {
	// Update status to let user know options were saved.
		var status = document.getElementById('status');
		status.textContent = 'Options saved.';
		setTimeout(function() {
		status.textContent = '';
		}, 1750);
		
	});
	
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {'usrOp': theValue, 'usrQt': likes}, function(response) {	
		});
	});
}
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
//self explanatory restore options on popup acctivated based on user pref
function restore_options() {
	chrome.storage.sync.get("usrOp", function(items) {
		console.log(items.usrOp);
		if(items.usrOp === 'imperial'){
			document.holder.system[0].checked = true;
			var status = document.getElementById('statusPref');
			status.textContent = 'You prefer the Imperial system!';
		}else if(items.usrOp === 'metric'){
			document.holder.system[1].checked = true;
			var status = document.getElementById('statusPref');
			status.textContent = 'You prefer the Metric system!';
		}
})
}


//add on load restore opt. needed for seatch of prev user choices in chrome.sync.get() .So fire away!
document.addEventListener('DOMContentLoaded', restore_options);

document.addEventListener('DOMContentLoaded', function () {
      
	  document.getElementById('save').addEventListener('click',save_options);
	
});
//notes:
//usrQp user question check or button to restore original page layout to be created ! 
// usrOp - user option - main setting imp or met .


