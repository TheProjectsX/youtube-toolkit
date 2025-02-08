import { useState } from "react";

const MaxVideoDuration = () => {
    const [maxDurationDetails, setMaxDurationDetails] = useState({
        isEnabled: false,
        h: 0,
        m: 0,
        s: 0,
    });

    chrome.storage.local.get(["turnOnMaxDuration", "maxDuration"], (result) => {
        setMaxDurationDetails({
            isEnabled: result.turnOnMaxDuration ?? false,
            h: (result.maxDuration ?? [0])[0],
            m: (result.maxDuration ?? [0, 0])[1],
            s: (result.maxDuration ?? [0, 0, 0])[2],
        });
    });

    const handleToggle = async () => {
        const newStatus = !maxDurationDetails.isEnabled;
        setMaxDurationDetails({
            ...maxDurationDetails,
            isEnabled: newStatus,
        });

        await chrome.storage.local.set({
            turnOnMaxDuration: newStatus,
            maxDuration: [
                maxDurationDetails.h,
                maxDurationDetails.m,
                maxDurationDetails.s,
            ],
        });
    };

    return (
        <div className="bg-gray-900 w-full flex flex-col items-center justify-center text-white p-4 gap-4">
            <h1 className="text-2xl font-bold mb-2">Max Duration</h1>
            <p className="text-[16px] text-center mb-4">Skip Longer Videos</p>

            <form
                onSubmit={(e) => e.preventDefault()}
                className="flex flex-col items-center gap-3 mb-4"
            >
                {/* Div containing 3 number inputs with a label which corresponds as time: H M S */}
                <div className="flex items-center gap-2 mb-3">
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
                                    h: e.target.value,
                                });
                            }}
                            placeholder="H"
                            className="w-6 text-black"
                        />
                        <label className="">H</label>
                    </div>
                    <div
                        className="relative flex items-center gap-1
                    "
                    >
                        <input
                            type="number"
                            name="minutes"
                            step="1"
                            min={0}
                            value={maxDurationDetails.m}
                            onChange={(e) => {
                                setMaxDurationDetails({
                                    ...maxDurationDetails,
                                    m: e.target.value,
                                });
                            }}
                            placeholder="M"
                            className="w-6 text-black"
                        />
                        <label className="">M</label>
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
                            value={maxDurationDetails.s}
                            onChange={(e) => {
                                setMaxDurationDetails({
                                    ...maxDurationDetails,
                                    s: e.target.value,
                                });
                            }}
                            placeholder="S"
                            className="w-6 text-black"
                        />
                        <label className="">S</label>
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
