/**
 * Converts a pixel coordinate on the track to a percent of the track's range
 */
export function convertPixelToPercent(
    pixelPos: number,
    minPosition: number,
    maxPosition: number,
    direction?: string
): number {
    let pct: number = 0;
    pct = (pixelPos - minPosition) / maxPosition;
    if (pct < 0) {
        pct = 0;
    } else if (pct > 1) {
        pct = 1;
    }

    if (typeof direction === "string" && direction === "rtl") {
        console.log("convertPixelToPercent using RTL");
        pct = 1 - pct;
    }

    console.log("slider-utilities pct:", pct);
    return pct;
}
