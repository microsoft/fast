import { ColorRGBA64 } from "./color-rgba-64";
/**
 * Creates an HTMLImageElement and loads the source argument as its src. Then an HTMLCanvasElement is created and the image is copied into the canvas. The pixel data is then returned from the CanvasRenderingContext2D for that canvas.
 *
 * @public
 */
export function loadImageData(source) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        if (!image) {
            reject("Unable to create image");
            return;
        }
        /* eslint-disable-next-line */
        image.onload = e => {
            const canvas = document.createElement("canvas");
            if (!canvas) {
                reject("Unable to create canvas");
                return;
            }
            canvas.width = image.naturalWidth;
            canvas.height = image.naturalHeight;
            const context = canvas.getContext("2d");
            if (!context) {
                reject("Unable to create context");
                return;
            }
            context.drawImage(image, 0, 0, canvas.width, canvas.height);
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            resolve(imageData);
        };
        image.onerror = e => {
            reject(e);
        };
        image.onabort = e => {
            reject(e);
        };
        image.src = source;
    });
}
/**
 * A {@link PixelBlob} implementation from an {@link https://developer.mozilla.org/en-US/docs/Web/API/ImageData | ImageData} object.
 * @public
 * @privateRemarks
 * Note that this class and the function loadImageData are not covered by unit tests
 * due to not being able to create a valid canvas rendering context or ImageData object
 * in the unit test framework. ArrayPixelBlob is used instead in tests needing a PixelBlob.
 */
export class ImageDataPixelBlob {
    constructor(image) {
        this.getPixel = (x, y) => {
            const rgba = this.getPixelRGBA(x, y);
            return new ColorRGBA64(
                rgba[0] / 255,
                rgba[1] / 255,
                rgba[2] / 255,
                rgba[3] / 255
            );
        };
        this.getPixelRGBA = (x, y) => {
            if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
                throw new Error("Requested pixel is outside of the image bounds");
            }
            const offset = (y * this.width + x) * 4;
            return [
                this.image.data[offset],
                this.image.data[offset + 1],
                this.image.data[offset + 2],
                this.image.data[offset + 3],
            ];
        };
        this.image = image;
        this.width = image.width;
        this.height = image.height;
        this.totalPixels = this.width * this.height;
    }
}
