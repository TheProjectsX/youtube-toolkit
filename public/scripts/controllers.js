let textNodeClone;

// Get Chrome Storage Data
const getStorageData = (keys, context = chrome) => {
    return new Promise((resolve, reject) => {
        context.storage.local.get(keys, (result) => {
            if (context.runtime.lastError) {
                reject(context.runtime.lastError);
            } else {
                resolve(result);
            }
        });
    });
};

// Set Dislike value in the UI
const setDislikeValue = async (value = "0", shorts = false) => {
    if (shorts) {
        const dislikeButtonTextSpan = visibleElementQuerySelector(
            "#dislike-button div.yt-spec-button-shape-with-label__label span[role='text']"
        );
        dislikeButtonTextSpan.innerText = value;
    } else {
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
            likeButton?.querySelector(
                ".yt-spec-button-shape-next__button-text-content"
            ) ||
            likeButton?.querySelector("button > div[class*='cbox']") ||
            (
                likeButton?.querySelector('div > span[role="text"]') ||
                document.querySelector(
                    'button > div.yt-spec-button-shape-next__button-text-content > span[role="text"]'
                )
            ).parentNode
        ).cloneNode(true);

        textNodeClone.innerText = value;
        disLikeButton.insertBefore(textNodeClone, null);

        disLikeButton.classList.remove(
            "yt-spec-button-shape-next--icon-button"
        );
        disLikeButton.classList.add("yt-spec-button-shape-next--icon-leading");
    }
    return true;
};

// Observe if the Dislike Element is Changed after Like in Video
const observeVideoDislikeElementChange = () => {
    const disLikeButton = visibleElementQuerySelector(
        "dislike-button-view-model button"
    );
    if (!disLikeButton) return;

    // Create a MutationObserver
    const observer = new MutationObserver((mutations) => {
        // Disconnect the observer to prevent recursive triggering
        observer.disconnect();

        if (shorts) {
            disLikeButton.innerText = value;
            console.log("Value of SHORTs DISLIKE changed");
        } else {
            // Safely modify the DOM
            if (!disLikeButton.contains(textNodeClone)) {
                disLikeButton.insertBefore(textNodeClone, null);
            }
            disLikeButton.classList.remove(
                "yt-spec-button-shape-next--icon-button"
            );
            disLikeButton.classList.add(
                "yt-spec-button-shape-next--icon-leading"
            );
        }

        // Reconnect the observer after modifications
        observer.observe(disLikeButton, { childList: true, subtree: false });
    });

    // Initial observation
    observer.observe(disLikeButton, { childList: true, subtree: false });
};

// Observe if the Dislike Element is Changed after Like in Shorts
const observeShortsDislikeElementChange = (value) => {
    const disLikeButton = visibleElementQuerySelector(
        "#dislike-button div.yt-spec-button-shape-with-label__label span[role='text']"
    );

    if (!disLikeButton) {
        console.error("Target parent element not found.");
        return;
    }

    // console.log("Observing:", disLikeButton);

    // Function to start observing a text node
    const startObservingTextNode = (parentElement) => {
        const textNode = parentElement.firstChild;

        if (!textNode) {
            console.error("No text node found.");
            return;
        }

        const textObserver = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === "characterData") {
                    console.log("Text changed to:", mutation.target.data);
                    disLikeButton.innerText = value;
                }
            }
        });

        textObserver.observe(textNode, {
            characterData: true, // Observe changes to text content
        });
    };

    // Start observing the parent for child changes
    const parentObserver = new MutationObserver(() => {
        console.log(
            "Parent contents replaced, re-attaching observer if exists..."
        );
        if (isElementVisible(disLikeButton)) {
            startObservingTextNode(disLikeButton); // Reinitialize text node observer
        }
    });

    parentObserver.observe(disLikeButton, {
        childList: true, // Detect changes to child nodes
        subtree: false, // Only observe direct children
    });

    // Initial observation
    startObservingTextNode(disLikeButton);
};

// Main function to Update Dislikes
const updateDislikesData = async (videoId, shorts = false) => {
    // console.log(videoId);
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
        // console.log(data);
        if (data.status === 400) {
            return;
        }

        const formattedDislikes = formatNumberWithIntl(data.dislikes ?? 0);

        // console.log("Dislikes", formattedDislikes);
        await DOMSettled(300);
        setDislikeValue(formattedDislikes, shorts);

        if (shorts) {
            observeShortsDislikeElementChange(formattedDislikes);
        } else {
            observeVideoDislikeElementChange();
        }
    } catch (error) {
        console.log("Error:", error);
    }
};
