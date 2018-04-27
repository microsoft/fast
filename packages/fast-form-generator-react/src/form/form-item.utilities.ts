/**
 * Get the string value of a number
 */
function getStringFromData(data: string | number): string {
    if (typeof data === "number") {
        return data.toString();
    }

    return data || "";
}

export function getStringValue(data: string | number, defaultData: string | number): string {
    return (typeof data === "string" || typeof data === "number")
        ? getStringFromData(data)
        : getStringFromData(defaultData);
}
