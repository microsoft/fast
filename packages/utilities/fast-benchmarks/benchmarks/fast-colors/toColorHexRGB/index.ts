import { ColorRGBA64 } from "@microsoft/fast-colors";

const colors: ColorRGBA64[] = [];
for (let r = 0; r < 1; r += 0.1) {
    for (let g = 0; g < 1; g += 0.1) {
        for (let b = 0; b < 1; b += 0.1) {
            colors.push(new ColorRGBA64(r, g, b));
        }
    }
}

(window as any).test = function () {
    for (const color of colors) {
        color.toStringHexRGB();
    }
};
