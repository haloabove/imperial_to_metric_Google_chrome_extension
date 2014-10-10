function save_options() {
	// Get a value saved in a form.
	var theValue = document.getElementById('units').value;
	var likes = document.getElementById('like').checked;
	// Check that there's some code there.
	if (!theValue) {
	  alert('Error: No value specified');
	  return;
	}
	// Save it using the Chrome extension storage API.
	chrome.storage.sync.set({'unitite': theValue, 'saka': likes},  function() {
	// Update status to let user know options were saved.
		var status = document.getElementById('status');
		status.textContent = 'Options saved.';
		setTimeout(function() {
		status.textContent = '';
		}, 1750);
		
	});
	
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {'unitite': theValue, 'saka': likes}, function(response) {	
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
function restore_options() {
	chrome.storage.sync.get("unitite", function(items) {
		document.getElementById('units').value = items.unitite;
		console.log(items);
});
chrome.storage.sync.get("saka", function(items) {
    document.getElementById('like').checked = items.saka;
	console.log(items);
});
}
	
document.addEventListener('DOMContentLoaded', restore_options);

document.addEventListener('DOMContentLoaded', function () {
      document.getElementById('save').addEventListener('click',save_options);
	
	
});

