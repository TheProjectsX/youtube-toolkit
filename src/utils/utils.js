export const secondsToHHMMSS = (seconds) => {
    if (!seconds || seconds === "") return;
    // Ensure input is a number
    seconds = Math.max(0, parseInt(seconds, 10));

    // Calculate hours, minutes, and seconds
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    // Format with leading zeros
    const formattedHours = String(hours).padStart(2, "0");
    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(secs).padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
};

export const sanitizeFileName = (name) => {
    // Define a list of invalid characters for file names
    const invalidCharacters = /[<>:"/\\|?*\u0000-\u001F]/g; // Reserved by Windows
    const reservedNames = [
        "CON",
        "PRN",
        "AUX",
        "NUL",
        "COM1",
        "COM2",
        "COM3",
        "COM4",
        "COM5",
        "COM6",
        "COM7",
        "COM8",
        "COM9",
        "LPT1",
        "LPT2",
        "LPT3",
        "LPT4",
        "LPT5",
        "LPT6",
        "LPT7",
        "LPT8",
        "LPT9",
    ];

    let sanitized = name.replace(invalidCharacters, "_");
    sanitized = sanitized.replace(/[. ]+$/, "");

    if (reservedNames.includes(sanitized.toUpperCase())) {
        sanitized += "_file";
    }

    return sanitized;
};
