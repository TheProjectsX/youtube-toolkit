// Function to format numbers in compact notation (e.g., k, M, B)
const formatNumberWithIntl = (
    number,
    userLocales = "en-US",
    formatterNotation = "compact",
    formatterCompactDisplay = "short"
) => {
    const formatter = new Intl.NumberFormat(userLocales, {
        notation: formatterNotation,
        compactDisplay: formatterCompactDisplay,
    });

    return formatter.format(number);
};

// Find visible Element by Query

const isElementVisible = (el) => {
    const style = getComputedStyle(el);
    return (
        style.display !== "none" && // Element is not set to display: none
        style.visibility !== "hidden" && // Element is not set to visibility: hidden
        style.opacity !== "0" && // Element is not completely transparent
        el.offsetWidth > 0 && // Element has a width
        el.offsetHeight > 0 // Element has a height
    );
};

const visibleElementQuerySelector = (query) => {
    const elements = document.querySelectorAll(query); // Get all elements by Query
    return Array.from(elements).find((el) => isElementVisible(el)); // Find the first visible element
};

// Time Sleep!

const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

// Dom Settle
const DOMSettled = async (timeout = 100) => {
    return new Promise((resolve) => {
        let timer;
        const observer = new MutationObserver(() => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                observer.disconnect();
                resolve(); // Resolve the promise when DOM has settled
            }, timeout);
        });

        observer.observe(document.body, { childList: true, subtree: true });
    });
};

// Capture Screenshot and Save
const captureScreenshot = (player, screenshotFormat = "png") => {
    let extension = screenshotFormat === "jpeg" ? "jpg" : screenshotFormat;
    let appendixTitle = "." + extension;
    let title = "";

    // Try to get video title from YouTube
    let headerEls = document.querySelectorAll(
        "h1.title.ytd-video-primary-info-renderer"
    );
    if (headerEls.length > 0) {
        title = headerEls[0].innerText.trim();
    } else {
        headerEls = document.querySelectorAll("h1.watch-title-container");
        if (headerEls.length > 0) title = headerEls[0].innerText.trim();
    }

    let time = player.currentTime;
    title += " ";
    let minutes = Math.floor(time / 60);
    time = Math.floor(time - minutes * 60);
    if (minutes > 60) {
        let hours = Math.floor(minutes / 60);
        minutes -= hours * 60;
        title += `${hours}h`;
    }
    title += `_${minutes}m_${time}s`;
    title += " " + appendixTitle;

    // Create canvas and draw video frame

    let canvas = document.createElement("canvas");
    canvas.width = player.videoWidth;
    canvas.height = player.videoHeight;
    canvas
        .getContext("2d")
        .drawImage(player, 0, 0, canvas.width, canvas.height);

    let downloadLink = document.createElement("a");
    downloadLink.download = title;

    function DownloadBlob(blob) {
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.click();
    }


    // Download the Image
    canvas.toBlob(function (blob) {
        DownloadBlob(blob);
    }, "image/" + screenshotFormat);
};
