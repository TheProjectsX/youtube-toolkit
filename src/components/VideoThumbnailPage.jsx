import { useEffect, useState } from "react";
import { sanitizeFileName } from "../utils/utils";

const VideoThumbnailPage = () => {
    const [videoData, setVideoData] = useState({});

    // Get the Video ID
    useEffect(() => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const title = tabs[0].title.replace("- YouTube", "").trim();

            const tabUrl = tabs[0].url;
            const urlObj = new URL(tabUrl);
            setVideoData({ id: urlObj.searchParams.get("v"), title });
        });
    }, []);

    // Handle Download
    const handleDownload = async (e) => {
        e.preventDefault();

        const resolution = e.target.resolution.value;
        const thumbnailUrl = `https://img.youtube.com/vi/${videoData.id}/${resolution}.jpg`;

        const response = await fetch(thumbnailUrl);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);

        const elmA = document.createElement("a");
        elmA.href = blobUrl;
        elmA.style.display = "none";
        elmA.download = `${sanitizeFileName(
            videoData.title
        )}_${resolution}.jpg`;

        document.body.appendChild(elmA);
        elmA.click();

        document.body.removeChild(elmA);
    };

    return (
        <div className="bg-gray-900 w-full flex flex-col items-center justify-center text-white p-4">
            <h1 className="text-2xl font-bold mb-6">Video Thumbnail</h1>

            <div className="w-full mb-4">
                {videoData.id && (
                    <img
                        src={`https://img.youtube.com/vi/${videoData.id}/hqdefault.jpg`}
                        alt="Video Thumbnail"
                    />
                )}
            </div>

            <div className="w-full">
                <form
                    onSubmit={handleDownload}
                    className="flex items-center justify-around gap-3"
                >
                    <select
                        name="resolution"
                        className="bg-slate-800 p-2 text-sm font-semibold rounded-xl outline-none max-w-[150px] cursor-pointer"
                    >
                        <option value="default">120x90 px</option>
                        <option value="mqdefault">329x180 px</option>
                        <option value="hqdefault" selected>
                            480x360 px
                        </option>
                        <option value="sddefault">640x480 px</option>
                        <option value="maxresdefault">
                            1280x720 px (Depends)
                        </option>
                    </select>

                    <button
                        type="submit"
                        className={`py-2 px-4 rounded-lg text-sm font-medium shadow-md transition-all duration-200 bg-blue-600 hover:bg-blue-500`}
                    >
                        Download
                    </button>
                </form>
            </div>
        </div>
    );
};

export default VideoThumbnailPage;
