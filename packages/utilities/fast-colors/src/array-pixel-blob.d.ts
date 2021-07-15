import { ColorRGBA64 } from "./color-rgba-64";
import { PixelBlob } from "./pixel-blob";
/**
 * Implements the PixelBlob interfaces using a a massive, ineffecient number array for pixel data. Not recomended for production use but comes in handy in unit tests or environments where creating a canvas drawing context isn't an option.
 */
export declare class ArrayPixelBlob implements PixelBlob {
    /**
     * @param image Expects a linear array of pixel data in RGBA format. Each entry should be in the range [0,255]
     * @param width width * height * 4 must exactly equal the length of the image array
     * @param height width * height * 4 must exactly equal the length of the image array
     */
    constructor(image: number[], width: number, height: number);
    private image;
    readonly width: number;
    readonly height: number;
    readonly totalPixels: number;
    getPixel: (x: number, y: number) => ColorRGBA64;
    getPixelRGBA: (x: number, y: number) => number[];
}
