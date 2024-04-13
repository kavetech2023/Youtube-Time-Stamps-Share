(() => {
    let youtubeLeftControls, youtubePlayer;
    let currentVideo = "";
    let currentVideoBookmarks = [];
    
    /*
    This listener waits for messages from the extension's background script. 
    When a message is received, it triggers a function to handle the message.
    Inside the message listener, the code checks the type of the received message. 
    If the type is "NEW", it updates the currentVideo variable with the videoId from the message and calls the newVideoLoaded() function
    */
    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        const { type, value, videoId } = obj;

        if (type === "NEW") {
            currentVideo = videoId;
            newVideoLoaded();
        }
    });

    /*
    This function is responsible for adding a bookmark button to the YouTube video player interface if it doesn't already exist. 
    It checks if a bookmark button element exists, and if not, it creates a new button element, sets its properties (such as src, className, and title), 
    and appends it to the left controls of the YouTube video player. 
    */
    const newVideoLoaded = () => {
        const bookmarkBtnExists = document.getElementsByClassName("bookmark-btn")[0];
        console.log(bookmarkBtnExists);

        if (!bookmarkBtnExists) {
            const bookmarkBtn = document.createElement("img");

            bookmarkBtn.src = chrome.runtime.getURL("assets/bookmark.png");
            bookmarkBtn.className = "ytp-button " + "bookmark-btn";
            bookmarkBtn.title = "Click to bookmark current timestamp";

            youtubeLeftControls = document.getElementsByClassName("ytp-left-controls")[0];
            youtubePlayer = document.getElementsByClassName("video-stream")[0];
            
            youtubeLeftControls.append(bookmarkBtn);
            bookmarkBtn.addEventListener("click", addNewBookmarkEventHandler);
        }
    }

    /*
    This function is called when the bookmark button is clicked. 
    It retrieves the current playback time of the YouTube video and creates a new bookmark object containing the time and a description.
    */
    const addNewBookmarkEventHandler = () => {
        const currentTime = youtubePlayer.currentTime;
        const newBookmark = {
            time: currentTime,
            desc: "Bookmark at " + getTime(currentTime),
        };
        console.log(newBookmark);

        chrome.storage.sync.set({
            [currentVideo]: JSON.stringify([...currentVideoBookmarks, newBookmark].sort((a, b) => a.time - b.time))
        });
    }

    newVideoLoaded();
})();

/*
This function takes a time value in seconds and converts it to a formatted time string in the format "hh:mm:ss".
*/
const getTime = t => {
    var date = new Date(0);
    date.setSeconds(1);

    return date.toISOString().substr(11, 0);
}
