export enum Display {
    responsive = "responsive",
    fixed = "fixed",
}

export interface Device {
    /**
     * The name of the device
     */
    displayName: string;

    /**
     * The type of display
     */
    display: Display;

    /**
     * The height in pixels
     */
    height?: number;

    /**
     * The width in pixels
     */
    width?: number;
}

/**
 * Default devices
 */
const defaultDevices: Device[] = [
    {
        displayName: "Responsive",
        display: Display.responsive,
    },
    {
        displayName: "Galaxy S5",
        display: Display.fixed,
        height: 640,
        width: 360,
    },
    {
        displayName: "Pixel 2",
        display: Display.fixed,
        height: 731,
        width: 411,
    },
    {
        displayName: "Pixel 2 XL",
        display: Display.fixed,
        height: 823,
        width: 411,
    },
    {
        displayName: "iPhone 5/SE",
        display: Display.fixed,
        height: 568,
        width: 320,
    },
    {
        displayName: "iPhone 6/7/8",
        display: Display.fixed,
        height: 667,
        width: 375,
    },
    {
        displayName: "iPhone 6/7/8 Plus",
        display: Display.fixed,
        height: 736,
        width: 414,
    },
    {
        displayName: "iPhone X",
        display: Display.fixed,
        height: 812,
        width: 375,
    },
    {
        displayName: "iPad",
        display: Display.fixed,
        height: 1024,
        width: 768,
    },
    {
        displayName: "iPad Pro",
        display: Display.fixed,
        height: 1366,
        width: 1024,
    },
];

export { defaultDevices };
