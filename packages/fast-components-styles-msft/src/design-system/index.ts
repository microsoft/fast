export interface IDesignSystem {
    foregroundColor: string;
    backgroundColor: string;
    brandColor: string;
}

const designSystemDefaults: IDesignSystem = {
    foregroundColor: "#000",
    backgroundColor: "#FFF",
    brandColor: "#0078D4"
};

/**
 * Returns RGBA from hex value with optional alpha
 * @param hex : Hex value
 * @param alpha : Optional alpha
 */
export function hexToRGB(hex: string, alpha: number): string {
    let r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);

    if (alpha) {
        return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
    } else {
        return "rgb(" + r + ", " + g + ", " + b + ")";
    }
}

export default designSystemDefaults;
