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
