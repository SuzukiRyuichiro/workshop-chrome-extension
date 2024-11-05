const sendBaconifyMsg = () => {
  // TODO: Write a function to send a message to the active tab to 'baconify' it
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    // Finds tabs that are active in the current window
    chrome.tabs.sendMessage(tabs[0].id, { action: "baconify" }); // Sends a message (object) to the first tab (tabs[0])
  });
};

// TODO: Add an event listener to trigger the function above when clicking the 'baconify' button
document
  .querySelector("#baconify")
  .addEventListener("click", (event) => sendBaconifyMsg());
