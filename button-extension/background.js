// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.executeScript(null, {file: "jquery-2.1.4.min.js"});
  chrome.tabs.executeScript(null, {file: "emoji-translate.js"});
});
