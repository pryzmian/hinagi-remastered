export function formatSeconds(seconds: number): string {
    const units = [
        { label: "year", value: 31536000 }, // 60 * 60 * 24 * 365
        { label: "month", value: 2592000 }, // 60 * 60 * 24 * 30
        { label: "week", value: 604800 }, // 60 * 60 * 24 * 7
        { label: "day", value: 86400 }, // 60 * 60 * 24
        { label: "hour", value: 3600 }, // 60 * 60
        { label: "minute", value: 60 }, // 60
        { label: "second", value: 1 },
    ];

    for (const unit of units) {
        if (seconds >= unit.value) {
            const count = Math.floor(seconds / unit.value);
            return `${count} ${unit.label}${count > 1 ? "s" : ""}`;
        }
    }

    return "0 seconds";
}
