var s = document.createElement('script');
s.src = chrome.extension.getURL('background.js');
(document.head||document.documentElement).appendChild(s);
