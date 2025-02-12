let textNodeClone;

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
    let result;
    try {
        result = await chrome.storage.local.get(["turnOnYTDislike"]);
    } catch (error) {
        result = {};
    }
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

// Check if two words are back-to-back in a string
const checkWordsBackToBack = (arr1, str2, threshold = 2) => {
    const safe_words = [
        "official",
        "lyrics",
        "lyric",
        "video",
        "audio",
        "remix",
        "cover",
        "live",
        "karaoke",
        "instrumental",
        "version",
        "acoustic",
        "extended",
        "edit",
        "unplugged",
        "concert",
        "performance",
        "festival",
        "session",
        "recording",
        "rehearsal",
        "remastered",
        "bootleg",
        "radio",
        "sped",
        "up",
        "slowed",
        "nightcore",
        "audio",
        "feat",
        "ft",
        "prod",
        "music",
        "mv",
        "hd",
        "4k",
        "exclusive",
        "trailer",
        "snippet",
    ];

    const words2 = str2.split(/\s+/); // Split str2 into words

    for (const str1 of arr1) {
        for (let i = 0; i <= words2.length - threshold; i++) {
            const pair2 = words2.slice(i, i + threshold).join(" "); // Get consecutive words based on threshold

            // Check if all words in the pair are in safe_words
            const allSafe = words2
                .slice(i, i + threshold)
                .every((word) => safe_words.includes(word));

            if (!allSafe && str1.includes(pair2)) {
                return true;
            }
        }
    }

    return false; // No valid matching pair found in any item of arr1
};

// Prevent Playback and Stuff!
const checkPreventPlayback = async () => {
    const turnOnPreventPlayback =
        (await getStorageData("turnOnPreventPlayback")) ?? false;
    const preventPlaybackLimit =
        (await getStorageData("preventPlaybackThreshold")) ?? 5;
    const preventPlaybackThreshold =
        (await getStorageData("preventPlaybackThreshold")) ?? 2;

    if (!turnOnPreventPlayback) {
        return;
    }

    await DOMSettled(300);
    const pastVideoTitles =
        JSON.parse(sessionStorage.getItem("pastVideoTitles")) ?? [];

    const videoTitle = document
        .querySelector("#title yt-formatted-string.ytd-watch-metadata")
        .textContent.toLowerCase()
        .trim();

    if (pastVideoTitles[pastVideoTitles.length - 1] === videoTitle) return;

    if (
        checkWordsBackToBack(
            pastVideoTitles.slice(0, preventPlaybackLimit),
            videoTitle,
            preventPlaybackThreshold
        )
    ) {
        const nextVideoButton = document.querySelector(
            "#ytd-player .ytp-next-button"
        );
        console.log("Next Video Button:", nextVideoButton);
        if (nextVideoButton) {
            console.log("Preventing Playback...");
            nextVideoButton.click();
        }
    } else {
        pastVideoTitles.push(videoTitle);
        console.log("Updated Video Titles:", pastVideoTitles);

        if (pastVideoTitles.length > preventPlaybackLimit) {
            pastVideoTitles.shift();
        }
        sessionStorage.setItem(
            "pastVideoTitles",
            JSON.stringify(pastVideoTitles)
        ); // Save to Session Storage
    }
};

// Check if Video's duration exceeds the Max Duration Threshold
const checkMaxDuration = async () => {
    const turnOnMaxDuration =
        (await getStorageData("turnOnMaxDuration")) ?? false;
    const maxDuration = await getStorageData("maxDuration");

    if (!turnOnMaxDuration || !maxDuration) {
        return;
    }

    await DOMSettled(500);
    const videoElement = document.querySelector("#ytd-player video");
    const videoDuration = videoElement.duration;

    const maxDurationInSeconds =
        maxDuration[0] * 3600 + maxDuration[1] * 60 + maxDuration[2];

    if (videoDuration > maxDurationInSeconds) {
        console.log(document.title);
        const nextVideoButton = document.querySelector(
            "#ytd-player .ytp-next-button"
        );

        if (nextVideoButton) {
            console.log("Skipping Video...");
            nextVideoButton.click();
        }
    }
};
