import { useEffect, useState } from "react";

const MaxVideoDuration = () => {
    const [maxDurationDetails, setMaxDurationDetails] = useState({
        isEnabled: false,
        h: 0,
        m: 0,
        s: 0,
    });

    useEffect(() => {
        chrome.storage.local.get(
            ["turnOnMaxDuration", "maxDuration"],
            (result) => {
                const [h = 0, m = 0, s = 0] = result.maxDuration ?? [];

                setMaxDurationDetails({
                    isEnabled: result.turnOnMaxDuration ?? false,
                    h,
                    m,
                    s,
                });
            }
        );
    }, []);

    const handleToggle = async () => {
        const newStatus = !maxDurationDetails.isEnabled;
        setMaxDurationDetails({
            ...maxDurationDetails,
            isEnabled: newStatus,
        });

        await chrome.storage.local.set({
            turnOnMaxDuration: newStatus,
        });
    };

    return (
        <div className="bg-gray-900 w-full flex flex-col items-center justify-center text-white p-4 gap-4">
            <h1 className="text-2xl font-bold mb-2">Max Duration</h1>
            <p className="text-[16px] text-center mb-4">Skip Longer Videos</p>

            <form
                onSubmit={async (e) => {
                    e.preventDefault();

                    await chrome.storage.local.set({
                        maxDuration: [
                            Number(e.target.hours.value),
                            Number(e.target.minutes.value),
                            Number(e.target.seconds.value),
                        ],
                    });
                }}
                className="flex flex-col items-center gap-3 mb-4"
            >
                <div className="flex items-center gap-2.5 mb-3">
                    <div className="relative flex items-center gap-1">
                        <input
                            type="number"
                            name="hours"
                            step="1"
                            min={0}
                            value={maxDurationDetails.h}
                            onChange={(e) => {
                                setMaxDurationDetails({
                                    ...maxDurationDetails,
                                    h: Number(e.target.value),
                                });
                            }}
                            placeholder="H"
                            className="w-12 px-2 py-2 rounded-lg bg-gray-800 text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                        <label className="text-lg font-medium">H</label>
                    </div>
                    <div className="relative flex items-center gap-1">
                        <input
                            type="number"
                            name="minutes"
                            step="1"
                            min={0}
                            max={59}
                            value={maxDurationDetails.m}
                            onChange={(e) => {
                                setMaxDurationDetails({
                                    ...maxDurationDetails,
                                    m: Number(e.target.value),
                                });
                            }}
                            placeholder="M"
                            className="w-12 px-2 py-2 rounded-lg bg-gray-800 text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                        <label className="text-lg font-medium">M</label>
                    </div>
                    <div
                        className="relative flex items-center gap-1
                    "
                    >
                        <input
                            type="number"
                            name="seconds"
                            step="1"
                            min={0}
                            max={59}
                            value={maxDurationDetails.s}
                            onChange={(e) => {
                                setMaxDurationDetails({
                                    ...maxDurationDetails,
                                    s: Number(e.target.value),
                                });
                            }}
                            placeholder="S"
                            className="w-12 px-2 py-2 rounded-lg bg-gray-800 text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                        <label className="text-lg font-medium">S</label>
                    </div>
                </div>

                {/* Apply button with bg dodgerBlue */}
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
                  maxDurationDetails.isEnabled
                      ? "bg-red-600 hover:bg-red-500"
                      : "bg-green-600 hover:bg-green-500"
              }`}
            >
                {maxDurationDetails.isEnabled ? "Turn Off" : "Turn On"}
            </button>
        </div>
    );
};

export default MaxVideoDuration;
