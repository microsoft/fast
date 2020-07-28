// this is derived from
// "https://github.com/elraccoone/react-unity-webgl"

declare class UnityLoader {
    constructor();

    /**
     * Initializes a new Unity player.
     * @param elementId the element ID where to bind the player.
     * @param source the path to the build json source.
     * @param options optional options to pass to the player.
     */
    public static instantiate(
        elementId: string,
        source: string,
        options?: Object
    ): UnityInstance;

    /**
     * Unity Error class.
     */
    public static Error: {
        /**
         * The error event handler.
         */
        handler: (error: Error) => void;
    };

    /**
     * Unity system info.
     */
    public static SystemInfo: {
        /**
         * Does the current system support webGL?
         */
        hasWebGL: boolean;

        /**
         * Is the current system a mobile device?
         */
        mobile: boolean;

        /**
         * The current systems browser.
         */
        browser: string;
    };
}
