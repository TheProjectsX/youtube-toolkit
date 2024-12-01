window.addEventListener("youtubeVideoOpened", (e) => {
    if (!e.detail.url.includes("watch?v=")) {
        return;
    }
    const urlObj = new URL(e.detail.url);
    const videoId = urlObj.searchParams.get("v");

    updateDislikesData(videoId);
});
