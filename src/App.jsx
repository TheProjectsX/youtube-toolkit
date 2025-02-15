import { useEffect, useState } from "react";
import Home from "./components/Home";
import YouTubeDislikePage from "./components/YouTubeDislikePage";
import VideoSpeedPage from "./components/VideoSpeedPage";
import RepeatSegmentPage from "./components/RepeatSegmentPage";
import VideoThumbnailPage from "./components/VideoThumbnailPage";
import VideoBookmarksPage from "./components/VideoBookmarksPage";
import PreventPlaybackPage from "./components/PreventPlaybackPage";
import MaxVideoDuration from "./components/MaxVideoDuration";
import { VideoTranscript } from "./components/VideoTranscript";

function App() {
    const [currentPage, setCurrentPage] = useState("home");
    const [isYouTube, setIsYouTube] = useState(true);
    const [isYouTubeVideoStatus, setIsYouTubeVideoStatus] = useState([
        true,
        false,
    ]); // YouTube Video, YouTube Shorts

    useEffect(() => {
        // Query the active tab's URL
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length > 0) {
                const url = tabs[0].url || "";
                setIsYouTube(url.includes("youtube.com"));
                setIsYouTubeVideoStatus([
                    url.includes("youtube.com/watch"),
                    url.includes("youtube.com/shorts/"),
                ]);
            }
        });
    }, []);

    return (
        <main className="w-80 py-6 h-[476px] bg-gray-900 flex flex-col items-center justify-center">
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
                                isYouTubeVideoStatus={isYouTubeVideoStatus}
                            />
                        ) : currentPage === "youtube-dislike" ? (
                            <YouTubeDislikePage />
                        ) : currentPage === "video-speed" ? (
                            <VideoSpeedPage
                                isYouTubeVideoStatus={isYouTubeVideoStatus}
                            />
                        ) : currentPage === "repeat-segment" ? (
                            <RepeatSegmentPage />
                        ) : currentPage === "video-thumbnail" ? (
                            <VideoThumbnailPage />
                        ) : currentPage === "video-bookmarks" ? (
                            <VideoBookmarksPage />
                        ) : currentPage === "prevent-playback" ? (
                            <PreventPlaybackPage />
                        ) : currentPage === "max-duration" ? (
                            <MaxVideoDuration />
                        ) : currentPage === "video-transcript" ? (
                            <VideoTranscript />
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
                    <p className="text-lg text-white text-center mx-auto">
                        You are not in{" "}
                        <span className="font-bold">YouTube</span>!
                    </p>
                </div>
            )}
        </main>
    );
}

export default App;
