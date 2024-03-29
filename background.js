const sendMessageToContentScript = (tabId, url) => {
  if (url && url.includes("youtube.com/watch")) {
    const queryParameters = url.split("?")[1];
    const urlParameters = new URLSearchParams(queryParameters);

    chrome.tabs.sendMessage(tabId, {
      type: "NEW",
      videoId: urlParameters.get("v"),
    }, function(response) {
      if (chrome.runtime.lastError) {
        console.log(`Error: ${chrome.runtime.lastError.message}`);
      } else {
        console.log(`Received response: ${response}`);
      }
    });
  }
};

  
