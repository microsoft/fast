// tslint:disable:member-ordering
import { ColorRGBA64 } from "./color-rgba-64";
import { PixelBlob } from "./pixel-blob";

/**
 * Implements the PixelBlob interfaces using a a massive, ineffecient number array for pixel data. Not recomended for production use but comes in handy in unit tests or environments where creating a canvas drawing context isn't an option.
 */
export class ArrayPixelBlob implements PixelBlob {
    /**
     * @param image Expects a linear array of pixel data in RGBA format. Each entry should be in the range [0,255]
     * @param width width * height * 4 must exactly equal the length of the image array
     * @param height width * height * 4 must exactly equal the length of the image array
     */
    constructor(image: number[], width: number, height: number) {
        if (image.length !== 4 * width * height) {
            throw new Error("Invalid image length for supplied width and height");
        }

        this.image = image;
        this.width = width;
        this.height = height;
        this.totalPixels = this.width * this.height;
    }

    private image: number[];

    public readonly width: number;
    public readonly height: number;
    public readonly totalPixels: number;

    public getPixel = (x: number, y: number): ColorRGBA64 => {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            throw new Error("Requested pixel is outside of the image bounds");
        }
        const offset: number = (y * this.width + x) * 4;
        return new ColorRGBA64(
            this.image[offset] / 255,
            this.image[offset + 1] / 255,
            this.image[offset + 2] / 255,
            this.image[offset + 3] / 255
        );
    };

    public getPixelRGBA = (x: number, y: number): number[] => {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            throw new Error("Requested pixel is outside of the image bounds");
        }
        const offset: number = (y * this.width + x) * 4;
        return [
            this.image[offset],
            this.image[offset + 1],
            this.image[offset + 2],
            this.image[offset + 3],
        ];
    };
}
