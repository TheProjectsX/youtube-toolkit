let textNodeClone;

// Set Dislike value in the UI
const setDislikeValue = async (value = "0") => {
    const likeButton = visibleElementQuerySelector(
        "like-button-view-model button"
    );

    const disLikeButton = visibleElementQuerySelector(
        "dislike-button-view-model button"
    );

    // Check if Already Added
    if (disLikeButton?.innerText?.includes(value)) {
        return;
    }

    textNodeClone = (
        likeButton.querySelector(
            ".yt-spec-button-shape-next__button-text-content"
        ) ||
        likeButton.querySelector("button > div[class*='cbox']") ||
        (
            likeButton.querySelector('div > span[role="text"]') ||
            document.querySelector(
                'button > div.yt-spec-button-shape-next__button-text-content > span[role="text"]'
            )
        ).parentNode
    ).cloneNode(true);

    textNodeClone.innerText = value;
    disLikeButton.insertBefore(textNodeClone, null);

    disLikeButton.classList.remove("yt-spec-button-shape-next--icon-button");
    disLikeButton.classList.add("yt-spec-button-shape-next--icon-leading");

    return true;
};

// Observe if the Dislike Element is Changed after Like
const observeDislikeElementChange = () => {
    const disLikeButton = visibleElementQuerySelector(
        "dislike-button-view-model button"
    );

    if (!disLikeButton) return;

    // Create a MutationObserver
    const observer = new MutationObserver((mutations) => {
        // Disconnect the observer to prevent recursive triggering
        observer.disconnect();

        // Safely modify the DOM
        if (!disLikeButton.contains(textNodeClone)) {
            disLikeButton.insertBefore(textNodeClone, null);
        }
        disLikeButton.classList.remove(
            "yt-spec-button-shape-next--icon-button"
        );
        disLikeButton.classList.add("yt-spec-button-shape-next--icon-leading");

        // Reconnect the observer after modifications
        observer.observe(disLikeButton, { childList: true, subtree: false });
    });

    // Initial observation
    observer.observe(disLikeButton, { childList: true, subtree: false });
};

// Main function to Update Dislikes
const updateDislikesData = async (videoId) => {
    console.log(videoId);
    const result = await getStorageData(["turnOnYTDislike"]);
    if (!result.turnOnYTDislike) {
        return;
    }

    try {
        const data = await (
            await fetch(
                `https://returnyoutubedislikeapi.com/votes?videoId=${videoId}`
            )
        ).json();
        console.log(data);
        if (data.status === 400) {
            return;
        }

        const formattedDislikes = formatNumberWithIntl(data.dislikes ?? 0);

        console.log("Dislikes", formattedDislikes);
        await DOMSettled(300);
        setDislikeValue(formattedDislikes);
        observeDislikeElementChange();
    } catch (error) {
        console.log("Error:", error);
    }
};
