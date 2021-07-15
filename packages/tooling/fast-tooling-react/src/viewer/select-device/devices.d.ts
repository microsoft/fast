export declare enum Display {
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
declare const defaultDevices: Device[];
export { defaultDevices };
