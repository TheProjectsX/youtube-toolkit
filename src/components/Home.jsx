const HomePage = ({ setCurrentPage, isYouTubeWatch }) => {
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
            disabled: !isYouTubeWatch,
        },
        {
            name: "Repeat Segment",
            icon: "🔄",
            page: "repeat-segment",
            title: "Repeat a Segment of Video",
            disabled: !isYouTubeWatch,
        },
    ];

    return (
        <div className="w-full bg-gray-900 flex flex-col items-center justify-center text-white p-4">
            <h1 className="text-2xl font-bold mb-6">YouTube Toolkit</h1>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
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
