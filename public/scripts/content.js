let videoId;

window.addEventListener("youtubeVideoOpened", (e) => {
    if (!e.detail.url.includes("watch?v=")) {
        return;
    }
    const urlObj = new URL(e.detail.url);
    videoId = urlObj.searchParams.get("v");

    updateDislikesData(videoId);
});

// Repeat Video Segments Controls
let repeatSegmentInterval = null;

// Messaged
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const processMessages = async () => {
        if (message.action === "get-video-timestamp") {
            const videoElement = document.querySelector("#ytd-player video");
            const currentTimestamp = videoElement.currentTime;
            const data = {};

            const oldData = (await getStorageData([videoId]))[videoId] ?? {};

            if (message.point === "a") {
                data[videoId] = {
                    "repeat-segment--point-a": currentTimestamp,
                    "repeat-segment--point-b":
                        oldData["repeat-segment--point-b"] ?? "",
                };
            } else if (message.point === "b") {
                data[videoId] = {
                    "repeat-segment--point-a":
                        oldData["repeat-segment--point-a"] ?? "",
                    "repeat-segment--point-b": currentTimestamp,
                };
            }
            await chrome.storage.local.set(data);

            sendResponse({ timestamp: currentTimestamp });
        } else if (message.action === "repeat-segment-clear-points") {
            const data = {};
            data[videoId] = {
                "repeat-segment--point-a": "",
                "repeat-segment--point-b": "",
            };
            chrome.storage.local.set(data);

            sendResponse({ success: true });
        } else if (message.action === "start-repeat-segment") {
            clearInterval(repeatSegmentInterval);

            const videoElement = document.querySelector("#ytd-player video");
            const interval = (message.pointB - message.pointA) * 1000; // Milliseconds
            videoElement.currentTime = message.pointA;
            videoElement.play();

            repeatSegmentInterval = setInterval(() => {
                videoElement.currentTime = message.pointA;
            }, interval);

            sendResponse({ started: true });
        } else if (message.action === "stop-repeat-segment") {
            clearInterval(repeatSegmentInterval);
            repeatSegmentInterval = null;
            sendResponse({ stopped: true });
        } else if (message.action === "get-repeat-segment-status") {
            if (repeatSegmentInterval) {
                sendResponse({ running: true });
            } else {
                sendResponse({ running: false });
            }
        } else if (message.action === "get-repeat-segment-initial-value") {
            const data = {};
            data["running"] = repeatSegmentInterval !== null;

            const result =
                (await getStorageData([videoId], chrome))[videoId] ?? {};
            data["repeat-segment--point-a"] =
                result["repeat-segment--point-a"] ?? "";
            data["repeat-segment--point-b"] =
                result["repeat-segment--point-b"] ?? "";

            sendResponse(data);
        }
    };

    processMessages();
    return true;
});
