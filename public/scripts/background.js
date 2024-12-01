chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    console.log(message);
    if (message.type === "fetchDislikes") {
        try {
            const [tab] = await chrome.tabs.query({
                active: true,
                currentWindow: true,
            });
            const urlObj = new URL(tab.url);
            const videoId = urlObj.searchParams.get("v");
            const data = await (
                await fetch(
                    `https://returnyoutubedislikeapi.com/votes?videoId=${videoId}`
                )
            ).json();

            // https://returnyoutubedislikeapi.com/votes?videoId=QgxYScXawEE
            sendResponse({ success: true, data });
        } catch (error) {
            sendResponse({ success: false, error: error.message });
        }
    }
    return true; // Keeps the message channel open for async responses
});
