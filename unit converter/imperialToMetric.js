
// Saves options to chrome.storage
// function save_options() {
	// var units = new Object();
	// units.unit = document.getElementById('units').value;
	// units.liked = document.getElementById('like').checked;

	// chrome.storage.sync.set(units, function() {
    //Update status to let user know options were saved.
    // var status = document.getElementById('status');
    // status.textContent = 'Options saved.';
    // setTimeout(function() {
      // status.textContent = '';
    // }, 1750);
  // });
// }

//vtor obid : Saves options to chrome.storage
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
         


//Restores select box and checkbox state using the preferences stored in chrome.storage.
/* function restore_options() {
  chrome.storage.sync.get("tiho", function(tiho) {
    document.getElementById('units').value = tiho[0];
    if (tiho[1]){
	document.getElementById('like').checked = tiho[1];
	}
  });
} */

//original 

function restore_options() {
  //Use default value units = 'metric' and likes = true.
  // chrome.storage.sync.get({
  // theValue: 'metric',  likes: 'true'
  // }, function(items) {
    // document.getElementById('units').value = items.theValue;
    // document.getElementById('like').checked = items.likes;
  // });
  chrome.storage.sync.get("unitite", function(items) {
    document.getElementById('units').value = items.unitite;
    //document.getElementById('like').checked = items.likes;
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

//ok sledno : 
1 zemi gi setiranjata od store.sync 
2 od setiranjata utvrdi koj od sistemite gi saka userot 
3 dodadi go parametarot na skriptata , 
4 T.E NAJDI NACIN OD STORAGE.SYNC DA ZEMES SETIRANJA VO SKRIPTA 
5 vo skriptata : 
-zemi gi site divovi od stranicata sto imaat text vo nego , stavi gi vo array
-za sekoj element vo nizata proveri mu go tekstot dali ima number ili ne  
ako ima 
zemi go brojot i vo odnos na toa sto odbral userot pretvori mu go brojot baziran na zborot posle nego 
ako nema prodolzi na sledniot vo nizata 

6 kreiraj niza so (top 3 sega za sega )najupotrebuvanite merki 
sekoja od merkite ke go mach-uvas so rezultatot od nizata pogore 
vo soodnos na koj zbor stoi do brojot ke go mnozis ili delis so soodveten faktor !  