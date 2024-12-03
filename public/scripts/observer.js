// Function to check if the current page is a YouTube video page
function isVideoPage() {
    return window.location.href.includes("watch?v=");
}

// Utility function to notify when URL changes
function notifyUrlChange() {
    const event = new CustomEvent("youtubeVideoOpened", {
        detail: { url: window.location.href },
    });
    window.dispatchEvent(event);
}

// Monitor History changes (pushState and replaceState)
const originalPushState = history.pushState;
const originalReplaceState = history.replaceState;

history.pushState = function (...args) {
    originalPushState.apply(history, args);
    if (isVideoPage()) {
        notifyUrlChange();
    }
};

history.replaceState = function (...args) {
    originalReplaceState.apply(history, args);
    if (isVideoPage()) {
        notifyUrlChange();
    }
};

// Listen for popstate (when user clicks back/forward)
window.addEventListener("popstate", () => {
    if (isVideoPage()) {
        notifyUrlChange();
    }
});

// Listen for hashchange (when YouTube search term changes)
window.addEventListener("hashchange", () => {
    if (isVideoPage()) {
        notifyUrlChange();
    }
});

// Trigger the event for the initial load, but only if it's a video page
setTimeout(() => {
    if (isVideoPage()) {
        notifyUrlChange();
    }
}, 1000);

// Observe changes in the DOM (useful for SPAs like YouTube)
const observer = new MutationObserver(() => {
    if (window.location.href !== previousUrl) {
        previousUrl = window.location.href;
        if (isVideoPage()) {
            notifyUrlChange();
        }
    }
});

let previousUrl = window.location.href;
observer.observe(document, { childList: true, subtree: true });
