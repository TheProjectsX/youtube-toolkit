import { useEffect, useState } from "react";
import Home from "./components/Home";
import YouTubeDislikePage from "./components/YouTubeDislikePage";
import VideoSpeedPage from "./components/VideoSpeed";
import RepeatSegmentPage from "./components/RepeatSegmentPage";

function App() {
    const [currentPage, setCurrentPage] = useState("home");
    const [isYouTube, setIsYouTube] = useState(true);
    const [isYouTubeWatch, setIsYouTubeWatch] = useState(true);

    useEffect(() => {
        // Query the active tab's URL
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0) {
                const url = tabs[0].url || "";
                setIsYouTube(url.includes("youtube.com"));
                setIsYouTubeWatch(url.includes("youtube.com/watch"));
            }
        });
    }, []);

    return (
        <main className="w-80 py-6 min-h-96 bg-gray-900 flex flex-col items-center justify-center">
            {isYouTube ? (
                <>
                    {currentPage !== "home" && (
                        <div className="w-full px-4">
                            <button
                                onClick={() => setCurrentPage("home")}
                                className="flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white font-medium shadow-md transition-all duration-200"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-5 h-5 mr-2"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M15 19l-7-7 7-7"
                                    ></path>
                                </svg>
                                Back
                            </button>
                        </div>
                    )}
                    <div className="flex-1 flex items-center justify-center">
                        {currentPage === "home" ? (
                            <Home
                                setCurrentPage={setCurrentPage}
                                isYouTubeWatch={isYouTubeWatch}
                            />
                        ) : currentPage === "youtube-dislike" ? (
                            <YouTubeDislikePage />
                        ) : currentPage === "video-speed" ? (
                            <VideoSpeedPage />
                        ) : currentPage === "repeat-segment" ? (
                            <RepeatSegmentPage />
                        ) : (
                            "Nothing"
                        )}
                    </div>
                    {currentPage !== "home" && <div></div>}
                </>
            ) : (
                <div>
                    <h1 className="text-2xl font-bold mb-6 text-center text-white">
                        YouTube Toolkit
                    </h1>
                    <p className="text-lg text-white text-center w-2/3 mx-auto">
                        You are not in a YouTube video Page!
                    </p>
                </div>
            )}
        </main>
    );
}

export default App;
