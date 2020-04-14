export enum Display {
    responsive = "responsive",
    fixed = "fixed",
}

export interface Device {
    /**
     * The unique device ID
     */
    id: string;

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
        id: "responsive",
        displayName: "Responsive",
        display: Display.responsive,
    },
    {
        id: "galaxyS5",
        displayName: "Galaxy S5",
        display: Display.fixed,
        height: 640,
        width: 360,
    },
    {
        id: "pixel2",
        displayName: "Pixel 2",
        display: Display.fixed,
        height: 731,
        width: 411,
    },
    {
        id: "pixel2XL",
        displayName: "Pixel 2 XL",
        display: Display.fixed,
        height: 823,
        width: 411,
    },
    {
        id: "iPhone5SE",
        displayName: "iPhone 5/SE",
        display: Display.fixed,
        height: 568,
        width: 320,
    },
    {
        id: "iPhone678",
        displayName: "iPhone 6/7/8",
        display: Display.fixed,
        height: 667,
        width: 375,
    },
    {
        id: "iPhone678Plus",
        displayName: "iPhone 6/7/8 Plus",
        display: Display.fixed,
        height: 736,
        width: 414,
    },
    {
        id: "iPhoneX",
        displayName: "iPhone X",
        display: Display.fixed,
        height: 812,
        width: 375,
    },
    {
        id: "iPad",
        displayName: "iPad",
        display: Display.fixed,
        height: 1024,
        width: 768,
    },
    {
        id: "iPadPro",
        displayName: "iPad Pro",
        display: Display.fixed,
        height: 1366,
        width: 1024,
    },
];

export { defaultDevices };
