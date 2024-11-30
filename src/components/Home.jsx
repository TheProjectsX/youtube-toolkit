const HomePage = ({ setCurrentPage }) => {
    const features = [
        { name: "YouTube Dislike", icon: "👎", page: "youtube-dislike" },
        { name: "Video Speed", icon: "⏩", page: "video-speed" },
        { name: "Repeat Segment", icon: "🔄", page: "repeat-segment" },
    ];

    return (
        <div className="w-full bg-gray-900 flex flex-col items-center justify-center text-white p-4">
            <h1 className="text-2xl font-bold mb-6">YouTube Toolkit</h1>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {features.map((feature, index) => (
                    <button
                        key={index}
                        className="flex flex-col items-center justify-center bg-gray-800 hover:bg-gray-700 transition-all duration-200 p-4 rounded-lg shadow-md text-center"
                        onClick={() => setCurrentPage(feature.page)}
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
