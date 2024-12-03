import React, { useEffect, useState } from "react";

const secondsToHHMMSS = (seconds) => {
    if (!seconds || seconds === "") return;
    // Ensure input is a number
    seconds = Math.max(0, parseInt(seconds, 10));

    // Calculate hours, minutes, and seconds
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    // Format with leading zeros
    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(secs).padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
};

const RepeatSegmentPage = () => {
    const [pointA, setPointA] = useState("");
    const [pointB, setPointB] = useState("");
    const [repeating, setRepeating] = useState(false);
    const [activeTabId, setActiveTabId] = useState();

    // Get the Stored Data
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        setActiveTabId(tabs[0].id);

        if (pointA === "" || pointB === "") {
            chrome.tabs.sendMessage(
                tabs[0].id,
                { action: "get-repeat-segment-initial-value" },
                (response) => {
                    console.log(response);
                    setRepeating(response.running);
                    setPointA(response["repeat-segment--point-a"]);
                    setPointB(response["repeat-segment--point-b"]);
                }
            );
        }
    });

    // Handle Changes
    const handleSetPointA = async () => {
        chrome.tabs.sendMessage(
            activeTabId,
            { action: "get-video-timestamp", point: "a" },
            (response) => {
                console.log(response);
                const { timestamp } = response;
                setPointA(timestamp);
            }
        );
    };

    const handleSetPointB = async () => {
        chrome.tabs.sendMessage(
            activeTabId,
            { action: "get-video-timestamp", point: "b" },
            (response) => {
                const { timestamp } = response;
                setPointB(timestamp);
            }
        );
    };

    const handleClearPoints = async () => {
        setPointA("");
        setPointB("");
    };

    const handleStartStopRepeat = async () => {
        if (!repeating) {
            setRepeating(true);
            chrome.tabs.sendMessage(
                activeTabId,
                { action: "start-repeat-segment", pointA, pointB },
                (response) => {
                    console.log("Start Repeat Segment Response:", response);
                }
            );
        } else {
            setRepeating(false);
            chrome.tabs.sendMessage(
                activeTabId,
                { action: "stop-repeat-segment" },
                (response) => {
                    console.log("Stop Repeat Segment Response:", response);
                }
            );
        }
    };

    return (
        <div className="bg-gray-900 w-full flex flex-col items-center justify-center text-white p-4">
            <h1 className="text-2xl font-bold mb-6">Repeat Segment</h1>

            <div className="flex flex-col items-center gap-6">
                {/* Point A */}
                <div className="flex items-center gap-4">
                    <p className="text-lg font-medium">Point A:</p>
                    <span
                        className={`text-lg font-bold px-4 py-2 rounded-md ${
                            pointA ? "bg-blue-600" : "bg-gray-700"
                        }`}
                    >
                        {secondsToHHMMSS(pointA) || "--:--:--"}
                    </span>
                    <button
                        onClick={handleSetPointA}
                        className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 font-medium shadow-md transition-all duration-200"
                    >
                        Set A
                    </button>
                </div>

                {/* Point B */}
                <div className="flex items-center gap-4">
                    <p className="text-lg font-medium">Point B:</p>
                    <span
                        className={`text-lg font-bold px-4 py-2 rounded-md ${
                            pointB ? "bg-blue-600" : "bg-gray-700"
                        }`}
                    >
                        {secondsToHHMMSS(pointB) || "--:--:--"}
                    </span>
                    <button
                        onClick={handleSetPointB}
                        className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 font-medium shadow-md transition-all duration-200"
                    >
                        Set B
                    </button>
                </div>

                {/* Clear Button */}
                <div className="flex items-center justify-center w-full flex-1 gap-4">
                    <button
                        onClick={handleStartStopRepeat}
                        className={`px-6 py-2 mt-4 rounded-lg ${
                            repeating
                                ? "bg-red-600 hover:bg-red-500"
                                : "bg-green-600"
                        } font-medium shadow-md transition-all duration-200 ${
                            !(pointA !== "" && pointB !== "")
                                ? "cursor-not-allowed"
                                : "hover:bg-green-500"
                        }`}
                        disabled={!(pointA !== "" && pointB !== "")}
                    >
                        {repeating ? "Stop Repeat" : "Start Repeat"}
                    </button>
                    <button
                        onClick={handleClearPoints}
                        className="px-6 py-2 mt-4 rounded-lg bg-red-600 hover:bg-red-500 font-medium shadow-md transition-all duration-200"
                    >
                        Clear Points
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RepeatSegmentPage;
