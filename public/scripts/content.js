// Save Video ID to use later
let videoId;

window.addEventListener("youtubeVideoOpened", async (e) => {
    const [isVideo, isShorts] = [e.detail.url.includes("watch?v="), false];

    if (!isVideo && !isShorts) {
        return;
    }
    const urlObj = new URL(e.detail.url);

    if (isShorts) {
        videoId = urlObj.pathname.split("/")[2];
    } else {
        videoId = urlObj.searchParams.get("v");
    }

    updateDislikesData(videoId, isShorts);

    const videoSpeed = sessionStorage.getItem("video-speed");

    if (videoSpeed) {
        await DOMSettled();
        const videoElement = document.querySelector("#ytd-player video");
        videoElement.playbackRate = parseFloat(videoSpeed);
    }
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

            const videoData = (await getStorageData([videoId]))[videoId] ?? {};

            if (message.point === "a") {
                data[videoId] = {
                    "repeat-segment--point-a": currentTimestamp,
                    "repeat-segment--point-b":
                        videoData["repeat-segment--point-b"] ?? "",
                };
            } else if (message.point === "b") {
                data[videoId] = {
                    "repeat-segment--point-a":
                        videoData["repeat-segment--point-a"] ?? "",
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
        } else if (message.action === "save-video-speed") {
            const speed = message.speed;

            // Save Speed to Session Storage
            sessionStorage.setItem("video-speed", speed);
            sendResponse({ success: true });
        } else if (message.action === "get-video-speed") {
            const videoElement = document.querySelector("#ytd-player video");
            const videoSpeed = videoElement.playbackRate;

            sendResponse({ speed: videoSpeed });
        } else if (message.action === "add-video-bookmark") {
            const videoElement = document.querySelector("#ytd-player video");
            const time = videoElement.currentTime;

            let videoData;
            try {
                videoData = (await getStorageData([videoId]))[videoId] ?? {};
            } catch (error) {
                videoData = {};
            }
            const oldBookmarks = videoData.bookmarks ?? [];
            oldBookmarks.push(time);
            videoData["bookmarks"] = oldBookmarks;
            const data = {};
            data[videoId] = videoData;

            await chrome.storage.local.set(data);

            sendResponse({ success: true, time: time });
        } else if (message.action === "get-video-bookmarks") {
            let videoData;
            try {
                videoData = (await getStorageData([videoId]))[videoId] ?? {};
            } catch (error) {
                videoData = {};
            }
            // console.log(videoData);
            const bookmarks = videoData.bookmarks ?? [];

            // console.log(bookmarks);
            sendResponse({ bookmarks });
        } else if (message.action === "remove-video-bookmark") {
            const time = message.time;
            const videoData = (await getStorageData([videoId]))[videoId] ?? {};
            const oldBookmarks = videoData.bookmarks ?? [];

            const newBookmarks = oldBookmarks.filter((item) => item !== time);

            videoData["bookmarks"] = newBookmarks;
            const data = {};
            data[videoId] = videoData;

            await chrome.storage.local.set(data);
            sendResponse({ success: true });
        }
    };

    processMessages();
    return true;
});
