import React, { useState } from "react";

const RepeatSegmentPage = () => {
    const [pointA, setPointA] = useState("");
    const [pointB, setPointB] = useState("");

    const handleSetPointA = () => {
        // Placeholder for setting Point A timestamp
        setPointA("00:00:00"); // Example value
    };

    const handleSetPointB = () => {
        // Placeholder for setting Point B timestamp
        setPointB("00:00:10"); // Example value
    };

    const handleClearPoints = () => {
        setPointA("");
        setPointB("");
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
                        {pointA || "--:--:--"}
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
                        {pointB || "--:--:--"}
                    </span>
                    <button
                        onClick={handleSetPointB}
                        className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 font-medium shadow-md transition-all duration-200"
                    >
                        Set B
                    </button>
                </div>

                {/* Clear Button */}
                <button
                    onClick={handleClearPoints}
                    className="px-6 py-2 mt-4 rounded-lg bg-red-600 hover:bg-red-500 font-medium shadow-md transition-all duration-200"
                >
                    Clear Points
                </button>
            </div>
        </div>
    );
};

export default RepeatSegmentPage;
