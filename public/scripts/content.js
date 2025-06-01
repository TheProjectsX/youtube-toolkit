// Get Storage data of Key
const getStorageData = async (key) => {
    let data = {};
    try {
        data = await chrome.storage.local.get([key]);
        data = data[key] ?? {};
    } catch (error) {}

    return data;
};

// Save Video ID to use later
let videoId;

window.addEventListener("youtubeVideoOpened", async (e) => {
    const [isVideo, isShorts] = [
        e.detail.url.includes("watch?v="),
        e.detail.url.includes("shorts/"),
    ];

    if (!isVideo && !isShorts) {
        return;
    }
    const urlObj = new URL(e.detail.url);

    if (isShorts) {
        videoId = urlObj.pathname.split("/")[2];
    } else {
        videoId = urlObj.searchParams.get("v");
    }

    if (!isShorts) {
        updateDislikesData(videoId, isShorts);
        checkPreventPlayback();
        checkMaxDuration();
    }

    const videoSpeed = sessionStorage.getItem("video-speed");

    if (videoSpeed) {
        await DOMSettled();
        document
            .querySelectorAll("ytd-player video")
            .forEach((elm) => (elm.playbackRate = parseFloat(videoSpeed)));
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

            const videoData = await getStorageData(videoId);

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

            const result = await getStorageData(videoId);
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
            let videoSpeed;
            if (!message.isShorts) {
                const videoElement =
                    document.querySelector("#ytd-player video");
                videoSpeed = videoElement.playbackRate;
            } else {
                document.querySelectorAll("ytd-player video").forEach((elm) => {
                    if (!(elm.playbackRate < videoSpeed)) {
                        videoSpeed = elm.playbackRate;
                    }
                });
            }

            sendResponse({ speed: videoSpeed });
        } else if (message.action === "add-video-bookmark") {
            const videoElement = document.querySelector("#ytd-player video");
            const time = videoElement.currentTime;

            const videoData = await getStorageData(videoId);

            const oldBookmarks = videoData.bookmarks ?? [];
            if (!oldBookmarks.includes(time)) {
                oldBookmarks.push(time);
            }

            videoData["bookmarks"] = oldBookmarks;
            const data = {};
            data[videoId] = videoData;

            await chrome.storage.local.set(data);

            sendResponse({ success: true, time: time });
        } else if (message.action === "get-video-bookmarks") {
            const videoData = await getStorageData(videoId);
            const bookmarks = videoData.bookmarks ?? [];

            sendResponse({ bookmarks });
        } else if (message.action === "remove-video-bookmark") {
            const time = message.time;
            const videoData = await getStorageData(videoId);
            const oldBookmarks = videoData.bookmarks ?? [];

            const newBookmarks = oldBookmarks.filter((item) => item !== time);

            videoData["bookmarks"] = newBookmarks;
            const data = {};
            data[videoId] = videoData;

            await chrome.storage.local.set(data);
            sendResponse({ success: true });
        } else if (message.action === "get-max-duration") {
            const timeData = await getStorageData("max-duration-time");

            const status =
                sessionStorage.getItem("max-duration--on") === "true";

            sendResponse({
                isEnabled: status,
                time: timeData ?? [],
            });
        } else if (message.action === "set-max-duration-status") {
            const isEnabled = message.isEnabled;

            // Save Status to Session Storage
            sessionStorage.setItem("max-duration--on", isEnabled);
            sendResponse({ success: true });
        } else if (message.action === "set-max-duration-time") {
            const time = message.time;

            await chrome.storage.local.set({ "max-duration-time": time });
            sendResponse({ success: true });
        }
    };

    processMessages();
    return true;
});
