const HomePage = ({ setCurrentPage, isYouTubeVideoStatus }) => {
    const features = [
        {
            name: "YouTube Dislike",
            icon: "👎",
            page: "youtube-dislike",
            title: "Turn ON or OFF YouTube Video Dislike Feature",
            disabled: false,
        },
        {
            name: "Video Speed",
            icon: "⏩",
            page: "video-speed",
            title: "Customize YouTube Video Speed",
            disabled: !isYouTubeVideoStatus[0] && !isYouTubeVideoStatus[1],
        },
        {
            name: "Repeat Segment",
            icon: "🔄",
            page: "repeat-segment",
            title: "Repeat a Segment of Video",
            disabled: !isYouTubeVideoStatus[0],
        },
        {
            name: "Video Thumbnail",
            icon: "🖼️",
            page: "video-thumbnail",
            title: "Get Thumbnail of The YouTube Video",
            disabled: !isYouTubeVideoStatus[0],
        },
        {
            name: "Bookmarks",
            icon: "🔖",
            page: "video-bookmarks",
            title: "Save your Video Bookmarks",
            disabled: !isYouTubeVideoStatus[0],
        },
        {
            name: "Prevent Replay",
            icon: "⏭️",
            page: "prevent-playback",
            title: "Prevent from Matching playback videos",
            disabled: false,
        },
        {
            name: "Max Duration",
            icon: "⏳",
            page: "max-duration",
            title: "Skips videos longer than a certain duration",
            disabled: false,
        },
    ];

    return (
        <div className="w-full bg-gray-900 flex flex-col items-center justify-center text-white p-4">
            <h1 className="text-2xl font-bold mb-6">YouTube Toolkit</h1>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 h-[360px] overflow-auto scrollbar-thin">
                {features.map((feature, index) => (
                    <button
                        key={index}
                        className={`flex flex-col items-center justify-center bg-gray-800 transition-all duration-200 p-4 rounded-lg shadow-md text-center ${
                            feature.disabled
                                ? "cursor-not-allowed"
                                : "hover:bg-gray-700"
                        }`}
                        onClick={() => setCurrentPage(feature.page)}
                        title={feature.title}
                        disabled={feature.disabled}
                    >
                        <span className="text-3xl mb-2">{feature.icon}</span>
                        <span className="text-sm font-medium">
                            {feature.name}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default HomePage;
