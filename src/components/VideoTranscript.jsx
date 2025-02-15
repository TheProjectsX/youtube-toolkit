import React, { useEffect, useState } from "react";
import LoadingSVG from "../assets/loading.svg";
import { sanitizeFileName } from "../utils/utils";

export const VideoTranscript = () => {
    const [videoData, setVideoData] = useState({});
    const [metadata, setMetadata] = useState({
        loading: false,
        error: null,
        transcriptData: null,
    });

    // Get the Video ID
    useEffect(() => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const title = tabs[0].title.replace("- YouTube", "").trim();

            const tabUrl = tabs[0].url;
            const urlObj = new URL(tabUrl);
            setVideoData({ id: urlObj.searchParams.get("v"), title });
        });
    }, []);

    fetch("https://api.uniscribe.co/tools/youtube-subtitle-download", {
        headers: {
            accept: "application/json, text/plain, */*",
            "accept-language": "en-US,en;q=0.9",
            "content-type": "application/json",
            "sec-ch-ua":
                '"Not A(Brand";v="8", "Chromium";v="132", "Google Chrome";v="132"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
        },
        referrer: "https://www.uniscribe.co/",
        referrerPolicy: "strict-origin-when-cross-origin",
        body: '{"videoId":"2P3i3MHND-Q","langCode":"en-orig","format":"csv"}',
        method: "POST",
        mode: "cors",
        credentials: "omit",
    });

    const handleParseTranscript = async () => {
        setMetadata({ loading: true, error: null });

        const response = await fetch("https://bypass-cors.vercel.app", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
                url: "https://api.uniscribe.co/tools/youtube-subtitle-list",
                options: {
                    headers: {
                        accept: "application/json, text/plain, */*",
                        "accept-language": "en-US,en;q=0.9",
                        "content-type": "application/json",
                        "sec-ch-ua":
                            '"Not A(Brand";v="8", "Chromium";v="132", "Google Chrome";v="132"',
                        "sec-ch-ua-mobile": "?0",
                        "sec-ch-ua-platform": '"Windows"',
                        "sec-fetch-dest": "empty",
                        "sec-fetch-mode": "cors",
                        "sec-fetch-site": "same-site",
                    },
                    referrer: "https://www.uniscribe.co/",
                    referrerPolicy: "strict-origin-when-cross-origin",
                    body: `{"url":"https://www.youtube.com/watch?v=${videoData.id}"}`,
                    method: "POST",
                    mode: "cors",
                    credentials: "omit",
                },
            }),
        });

        const data = await response.json();
        if (!data.subtitles) {
            setMetadata({
                loading: false,
                error: "No subtitles found",
                transcriptData: null,
            });
        } else {
            setMetadata({
                loading: false,
                error: null,
                transcriptData: data.subtitles,
            });
        }
    };

    const handleDownloadTranscript = async (e) => {
        e.preventDefault();

        const format = e.target.format.value;

        const response = await fetch("https://bypass-cors.vercel.app", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
                url: "https://api.uniscribe.co/tools/youtube-subtitle-download",
                options: {
                    headers: {
                        accept: "application/json, text/plain, */*",
                        "accept-language": "en-US,en;q=0.9",
                        "content-type": "application/json",
                        "sec-ch-ua":
                            '"Not A(Brand";v="8", "Chromium";v="132", "Google Chrome";v="132"',
                        "sec-ch-ua-mobile": "?0",
                        "sec-ch-ua-platform": '"Windows"',
                        "sec-fetch-dest": "empty",
                        "sec-fetch-mode": "cors",
                        "sec-fetch-site": "same-site",
                    },
                    referrer: "https://www.uniscribe.co/",
                    referrerPolicy: "strict-origin-when-cross-origin",
                    body: JSON.stringify({
                        videoId: videoData.id,
                        langCode: metadata.transcriptData[0].langCode,
                        format: format,
                    }),
                    method: "POST",
                    mode: "cors",
                    credentials: "omit",
                },
            }),
        });

        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);

        const elmA = document.createElement("a");
        elmA.href = blobUrl;
        elmA.style.display = "none";
        elmA.download = `${sanitizeFileName(
            videoData.title
        )}_transcript.${format}`;

        document.body.appendChild(elmA);
        elmA.click();

        document.body.removeChild(elmA);
    };

    return (
        <div className="bg-gray-900 w-full flex flex-col items-center justify-center text-white p-4">
            <h1 className="text-2xl font-bold mb-2">Video Transcript</h1>
            <p className="text-[16px] text-center mb-4">
                Download Video Transcript
            </p>
            {!metadata.transcriptData &&
                (metadata.loading ? (
                    <div className="flex flex-col items-center justify-center gap-3 mb-4">
                        <img
                            src={LoadingSVG}
                            alt="Loading Icon"
                            className="w-12"
                        />
                        <p className="text-lg">Loading Transcript...</p>
                    </div>
                ) : (
                    <button
                        onClick={handleParseTranscript}
                        className={`py-2 px-4 rounded-lg text-sm font-medium shadow-md transition-all duration-200 bg-blue-600 hover:bg-blue-500 mb-4`}
                    >
                        Parse Transcript
                    </button>
                ))}

            {metadata.transcriptData && (
                <form
                    onSubmit={handleDownloadTranscript}
                    className="flex items-center gap-3"
                >
                    <select
                        name="format"
                        className="bg-slate-800 p-2 text-sm font-semibold rounded-xl outline-none max-w-[150px] cursor-pointer"
                    >
                        {metadata.transcriptData[0].availableFormats.map(
                            (item) => (
                                <option key={item} value={item}>
                                    {item.toUpperCase()}
                                </option>
                            )
                        )}
                    </select>
                    <button
                        type="submit"
                        className="py-2 px-4 rounded-lg text-sm font-medium shadow-md transition-all duration-200 bg-blue-600 hover:bg-blue-500"
                    >
                        Download
                    </button>
                </form>
            )}

            {metadata.error && (
                <p className="italic text-red-500 text-base">
                    {metadata.error}
                </p>
            )}
        </div>
    );
};
