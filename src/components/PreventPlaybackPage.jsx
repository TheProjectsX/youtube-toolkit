import { useState } from "react";

const PreventPlaybackPage = () => {
    const [preventPlaybackDetails, setPreventPlaybackDetails] = useState({
        isEnabled: false,
        limit: 5,
        threshold: 2,
    });

    chrome.storage.local.get(
        ["turnOnPreventPlayback", "preventPlaybackThreshold"],
        (result) => {
            setPreventPlaybackDetails({
                isEnabled: result.turnOnPreventPlayback ?? false,
                limit: result.preventPlaybackLimit ?? 5,
                threshold: result.preventPlaybackThreshold ?? 2,
            });
        }
    );

    const handleToggle = async () => {
        const newStatus = !preventPlaybackDetails.isEnabled;
        setPreventPlaybackDetails({
            isEnabled: newStatus,
            limit: preventPlaybackDetails.limit,
            threshold: preventPlaybackDetails.threshold,
        });

        await chrome.storage.local.set({
            turnOnPreventPlayback: newStatus,
            preventPlaybackLimit: 5,
            preventPlaybackThreshold: 2,
        });
    };

    return (
        <div className="bg-gray-900 w-full flex flex-col items-center justify-center text-white p-4">
            <h1 className="text-2xl font-bold mb-2">Prevent Playback</h1>
            <p className="text-[16px] text-center mb-4">
                Prevent Repeated videos
            </p>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    chrome.storage.local.set({
                        preventPlaybackLimit: preventPlaybackDetails.limit,
                    });
                }}
                className="flex items-center gap-2 mb-3"
                title="Set Limit of How much Video Data will be stored to prevent Playback"
            >
                <div className="relative flex items-center">
                    <input
                        type="number"
                        name="limit"
                        step="1"
                        min={1}
                        value={preventPlaybackDetails.limit}
                        onChange={(e) =>
                            setPreventPlaybackDetails({
                                ...preventPlaybackDetails,
                                limit: e.target.value,
                            })
                        }
                        placeholder="Limit"
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
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    chrome.storage.local.set({
                        preventPlaybackThreshold:
                            preventPlaybackDetails.threshold,
                    });
                }}
                className="flex items-center gap-2 mb-4"
                title="Set Threshold of similarity checking to prevent Playback"
            >
                <div className="relative flex items-center">
                    <input
                        type="number"
                        name="threshold"
                        step="1"
                        min={1}
                        value={preventPlaybackDetails.threshold}
                        onChange={(e) =>
                            setPreventPlaybackDetails({
                                ...preventPlaybackDetails,
                                threshold: e.target.value,
                            })
                        }
                        placeholder="Threshold"
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
            <button
                onClick={handleToggle}
                className={`w-full py-2 rounded-lg text-sm font-medium shadow-md transition-all duration-200 
              ${
                  preventPlaybackDetails.isEnabled
                      ? "bg-red-600 hover:bg-red-500"
                      : "bg-green-600 hover:bg-green-500"
              }`}
            >
                {preventPlaybackDetails.isEnabled ? "Turn Off" : "Turn On"}
            </button>
        </div>
    );
};

export default PreventPlaybackPage;
