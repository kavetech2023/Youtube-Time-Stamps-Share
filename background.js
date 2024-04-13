/*
Function checks if the URL on the active Tab is "youtube.com"
If the URL matches the YouTube video watch page, 
it extracts the query parameters from the URL by splitting the URL string at the "?" character and selecting the portion after it
*/
const sendMessageToContentScript = (tabId, url) => {
  if (url && url.includes("youtube.com/watch")) {
    const queryParameters = url.split("?")[1];
    const urlParameters = new URLSearchParams(queryParameters);

    
    /*
    After extracting the video ID, the function sends a message to the content script of the active tab using chrome.tabs.sendMessage(). 
    The message contains an object with two properties:
        type: Set to "NEW" to indicate that a new video is being watched.
        videoId: The extracted video ID from the URL at hand at the current moment.
    */
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

  
