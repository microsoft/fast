import { ColorRGBA64 } from "./color-rgba-64";
/**
 * Represents a blob of pixel data.
 *
 * @public
 */
export interface PixelBlob {
    width: number;
    height: number;
    totalPixels: number;
    getPixel(x: number, y: number): ColorRGBA64;
    /**
     * Returns an array of 4 numbers in the range [0,255] in order RGBA
     */
    getPixelRGBA(x: number, y: number): number[];
}
/**
 * Creates an HTMLImageElement and loads the source argument as its src. Then an HTMLCanvasElement is created and the image is copied into the canvas. The pixel data is then returned from the CanvasRenderingContext2D for that canvas.
 *
 * @public
 */
export declare function loadImageData(source: string): Promise<ImageData>;
/**
 * A {@link PixelBlob} implementation from an {@link https://developer.mozilla.org/en-US/docs/Web/API/ImageData | ImageData} object.
 * @public
 * @privateRemarks
 * Note that this class and the function loadImageData are not covered by unit tests
 * due to not being able to create a valid canvas rendering context or ImageData object
 * in the unit test framework. ArrayPixelBlob is used instead in tests needing a PixelBlob.
 */
export declare class ImageDataPixelBlob implements PixelBlob {
    constructor(image: ImageData);
    private image;
    readonly width: number;
    readonly height: number;
    readonly totalPixels: number;
    getPixel: (x: number, y: number) => ColorRGBA64;
    getPixelRGBA: (x: number, y: number) => number[];
}
