import { useState } from "react";

import { secondsToHHMMSS } from "../utils/utils";

const VideoBookmarks = () => {
    const [bookmarks, setBookmarks] = useState([]);

    // Get Bookmarks of Current Video
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(
            tabs[0].id,
            { action: "get-video-bookmarks" },
            (response) => {
                console.log(response);
                setBookmarks(response.bookmarks ?? []);
            }
        );
    });

    const saveBookmark = () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(
                tabs[0].id,
                { action: "add-video-bookmark" },
                (response) => {
                    console.log("Add Bookmarks Response", response);
                    setBookmarks([...bookmarks, response.time]);
                }
            );
        });
    };

    const handleGoToTime = async (time) => {
        const [tab] = await chrome.tabs.query({ active: true });

        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            args: [time],
            func: (time) => {
                const videoElement =
                    document.querySelector("#ytd-player video");
                videoElement.currentTime = time;
            },
        });
    };

    const handleRemoveBookmark = (time) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(
                tabs[0].id,
                { action: "remove-video-bookmark", time },
                (response) => {
                    setBookmarks("Remove Bookmarks Response", response);
                }
            );
        });

        setBookmarks((prev) => prev.filter((item) => item !== time));
    };

    return (
        <div className="bg-gray-900 w-full flex flex-col items-center justify-center text-white p-4">
            <h1 className="text-2xl font-bold mb-6">Video Bookmarks</h1>

            {bookmarks.length > 0 ? (
                <div className="h-44 overflow-auto space-y-2 w-48">
                    {bookmarks.map((second, idx) => (
                        <div
                            key={idx}
                            className="rounded-xl overflow-hidden flex shadow-xl"
                        >
                            <button
                                className="bg-gray-800 hover:bg-gray-700 border-r-2 border-gray-800 active:bg-[dodgerBlue] grow text-center py-2 font-bold text-lg"
                                onClick={() => handleGoToTime(second)}
                            >
                                {secondsToHHMMSS(second)}
                            </button>
                            <button
                                className="bg-gray-700 py-2 px-3 hover:bg-gray-600"
                                onClick={() => handleRemoveBookmark(second)}
                            >
                                ❌
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div>
                    <h2 className="text-lg italic text-gray-600">
                        No Bookmarks for the Video
                    </h2>
                </div>
            )}

            <div className="mt-5">
                <button
                    className="py-2 px-4 rounded-lg text-sm font-medium shadow-md transition-all duration-200 bg-blue-600 hover:bg-blue-500"
                    title="Save this point in Video to Bookmark"
                    onClick={saveBookmark}
                >
                    Save Time
                </button>
            </div>
        </div>
    );
};

export default VideoBookmarks;
