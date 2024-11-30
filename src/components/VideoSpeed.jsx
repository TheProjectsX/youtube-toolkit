import React, { useState } from "react";

const VideoSpeedPage = () => {
    const [selectedSpeed, setSelectedSpeed] = useState(1); // Default is 1x
    const [customSpeed, setCustomSpeed] = useState("");

    const predefinedSpeeds = [1, 2, 3, 5, 8, 10];

    const handleSpeedClick = (speed) => {
        setSelectedSpeed(speed);
        setCustomSpeed(""); // Clear custom speed when a predefined one is selected
    };

    const handleCustomSpeedChange = (e) => {
        const value = e.target.value;
        setCustomSpeed(value);
        setSelectedSpeed(null); // Clear predefined selection when custom speed is entered
    };

    const applyCustomSpeed = () => {
        if (customSpeed) {
            setSelectedSpeed(customSpeed);
        }
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
                            selectedSpeed === speed
                                ? "bg-blue-600"
                                : "bg-gray-800 hover:bg-gray-700"
                        }`}
                    >
                        {speed}x
                    </button>
                ))}

                {/* Custom Speed Input */}
                <div className="flex items-center gap-2">
                    <div className="relative flex items-center">
                        <input
                            type="number"
                            step="0.1"
                            min="0.1"
                            placeholder="Custom x"
                            value={customSpeed}
                            onChange={handleCustomSpeedChange}
                            className="w-24 px-2 py-2 rounded-lg bg-gray-800 text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                    </div>
                    <button
                        onClick={applyCustomSpeed}
                        className={`py-2 px-4 rounded-lg text-sm font-medium shadow-md transition-all duration-200 ${
                            customSpeed
                                ? "bg-blue-600 hover:bg-blue-500"
                                : "bg-gray-700 cursor-not-allowed"
                        }`}
                        disabled={!customSpeed}
                    >
                        Apply
                    </button>
                </div>
            </div>

            {/* Display Selected Speed */}
            {selectedSpeed && (
                <p className="mt-6 text-lg">
                    Selected Speed:{" "}
                    <span className="font-bold">{selectedSpeed}x</span>
                </p>
            )}
        </div>
    );
};

export default VideoSpeedPage;
