import React, { useState } from "react";

const YouTubeDislikePage = () => {
    const [isEnabled, setIsEnabled] = useState(false);

    chrome.storage.local.get(["turnOnYTDislike"], (result) => {
        setIsEnabled(result.turnOnYTDislike);
    });

    const handleToggle = async () => {
        const newStatus = !isEnabled;
        setIsEnabled(newStatus);

        await chrome.storage.local.set({ turnOnYTDislike: newStatus });
    };

    return (
        <div className="bg-gray-900 w-full flex flex-col items-center justify-center text-white p-4">
            <h1 className="text-2xl font-bold mb-6">YouTube Dislike</h1>

            <div className="flex flex-col items-center gap-4">
                <p className="text-[16px] text-center">
                    {isEnabled
                        ? "YouTube dislikes are currently visible."
                        : "YouTube dislikes are hidden."}
                </p>

                <button
                    onClick={handleToggle}
                    className={`w-32 py-2 rounded-lg text-sm font-medium shadow-md transition-all duration-200 
            ${
                isEnabled
                    ? "bg-red-600 hover:bg-red-500"
                    : "bg-green-600 hover:bg-green-500"
            }`}
                >
                    {isEnabled ? "Turn Off" : "Turn On"}
                </button>
            </div>
        </div>
    );
};

export default YouTubeDislikePage;
