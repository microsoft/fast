/**
 * Converts a pixel coordinate on the track to a percent of the track's range
 */
export function convertPixelToPercent(
    pixelPos: number,
    minPosition: number,
    maxPosition: number
): number {
    let pct: number = 0;
    pct = (pixelPos - minPosition) / maxPosition;
    if (pct < 0) {
        pct = 0;
    } else if (pct > 1) {
        pct = 1;
    }
    // if (
    //     this.state.direction === Direction.rtl &&
    //     this.props.orientation !== SliderOrientation.vertical
    // ) {
    //     pct = 1 - pct;
    // }

    return pct;
}
