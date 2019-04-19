// tslint:disable:member-ordering
import { ColorRGBA64 } from "./color-rgba-64";

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
 */
export function loadImageData(source: string): Promise<ImageData> {
    return new Promise<ImageData>(
        (
            resolve: (value?: ImageData | PromiseLike<ImageData>) => void,
            reject: (reason?: any) => void
        ): void => {
            const image: HTMLImageElement = new Image();
            if (!image) {
                reject("Unable to create image");
                return;
            }
            image.onload = (e: Event): void => {
                const canvas: HTMLCanvasElement = document.createElement("canvas");
                if (!canvas) {
                    reject("Unable to create canvas");
                    return;
                }
                canvas.width = image.naturalWidth;
                canvas.height = image.naturalHeight;
                const context: CanvasRenderingContext2D | null = canvas.getContext("2d");
                if (!context) {
                    reject("Unable to create context");
                    return;
                }
                context.drawImage(image, 0, 0, canvas.width, canvas.height);
                const imageData: ImageData = context.getImageData(
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );
                resolve(imageData);
            };
            image.onerror = (e: any): void => {
                reject(e);
            };
            image.onabort = (e: any): void => {
                reject(e);
            };
            image.src = source;
        }
    );
}

// Note that this class and the function loadImageData are not covered by unit tests
// due to not being able to create a valid canvas rendering context or ImageData object
// in the unit test framework. ArrayPixelBlob is used instead in tests needing a PixelBlob.
export class ImageDataPixelBlob implements PixelBlob {
    constructor(image: ImageData) {
        this.image = image;
        this.width = image.width;
        this.height = image.height;
        this.totalPixels = this.width * this.height;
    }

    private image: ImageData;

    public readonly width: number;
    public readonly height: number;
    public readonly totalPixels: number;

    public getPixel = (x: number, y: number): ColorRGBA64 => {
        const rgba: number[] = this.getPixelRGBA(x, y);
        return new ColorRGBA64(
            rgba[0] / 255,
            rgba[1] / 255,
            rgba[2] / 255,
            rgba[3] / 255
        );
    };

    public getPixelRGBA = (x: number, y: number): number[] => {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            throw new Error("Requested pixel is outside of the image bounds");
        }
        const offset: number = (y * this.width + x) * 4;
        return [
            this.image.data[offset],
            this.image.data[offset + 1],
            this.image.data[offset + 2],
            this.image.data[offset + 3],
        ];
    };
}
