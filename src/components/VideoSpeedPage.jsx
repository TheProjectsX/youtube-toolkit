import { useState } from "react";

const VideoSpeedPage = ({ isYouTubeVideoStatus }) => {
    const [currentSpeed, setCurrentSpeed] = useState(null);
    const predefinedSpeeds = [1, 2, 3, 5, 8, 10];

    // Get Speed of Current Video
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(
            tabs[0].id,
            { action: "get-video-speed", isShorts: isYouTubeVideoStatus[1] },
            (response) => {
                setCurrentSpeed(response.speed);
            }
        );
    });

    const setVideoSpeed = async (speed) => {
        const [tab] = await chrome.tabs.query({
            active: true,
            currentWindow: true,
        });

        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            args: [speed, isYouTubeVideoStatus[1]],
            func: (speed, shorts) => {
                if (!shorts) {
                    const videoElement =
                        document.querySelector("#ytd-player video");
                    videoElement.playbackRate = speed;
                } else {
                    document
                        .querySelectorAll("ytd-player video")
                        .forEach((elm) => (elm.playbackRate = speed));
                }
            },
        });

        chrome.tabs.sendMessage(
            tab.id,
            { action: "save-video-speed", speed },
            (response) => {
                console.log("Save Video Speed Response", response);
            }
        );
    };

    const handleSpeedClick = (speed) => {
        setCurrentSpeed(speed);
        setVideoSpeed(speed);
    };

    const handleCustomSpeedChange = (e) => {
        e.preventDefault();
        const speed = parseFloat(e.target.speed.value);
        setCurrentSpeed(speed);

        setVideoSpeed(speed);
    };

    return (
        <div className="bg-gray-900 w-full flex flex-col items-center justify-center text-white p-4">
            <h1 className="text-2xl font-bold mb-6">Video Speed</h1>

            <div className="flex flex-wrap gap-4 justify-center">
                {predefinedSpeeds.map((speed) => (
                    <button
                        key={speed}
                        onClick={() => handleSpeedClick(speed)}
                        className={`w-20 py-2 rounded-lg text-sm font-medium shadow-md transition-all duration-200 ${
                            currentSpeed === speed
                                ? "bg-blue-600"
                                : "bg-gray-800 hover:bg-gray-700"
                        }`}
                    >
                        {speed}x
                    </button>
                ))}

                {/* Custom Speed Input */}
                <form
                    onSubmit={handleCustomSpeedChange}
                    className="flex items-center gap-2"
                >
                    <div className="relative flex items-center">
                        <input
                            type="number"
                            name="speed"
                            step="0.1"
                            min={0.1}
                            placeholder="Custom x"
                            className="w-24 px-2 py-2 rounded-lg bg-gray-800 text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className={`py-2 px-4 rounded-lg text-sm font-medium shadow-md transition-all duration-200 bg-blue-600 hover:bg-blue-500`}
                    >
                        Apply
                    </button>
                </form>
            </div>

            {/* Display Selected Speed */}

            <p className="mt-6 text-lg">
                Selected Speed:{" "}
                {currentSpeed ? (
                    <span className="font-bold">{currentSpeed}x</span>
                ) : (
                    <span className="font-bold italic">None</span>
                )}
            </p>
        </div>
    );
};

export default VideoSpeedPage;
