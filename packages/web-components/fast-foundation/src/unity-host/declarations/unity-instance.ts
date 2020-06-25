// this is derived from
// "https://github.com/elraccoone/react-unity-webgl"

declare class UnityInstance {
    constructor();

    /**
     * Sends an message to the unity player.
     * @param gameObjectName the game object name.
     * @param methodName the public method name.
     * @param parameter an optional parameter.
     */
    public SendMessage(gameObjectName: string, methodName: string, parameter?: any): void;

    /**
     * Sets the player to fullscreen.
     * @param {boolean} fullScreen
     */
    public SetFullscreen(fullScreen: number): void;

    /**
     * Quits the Unity WebGL application
     * and removes it from the memory.
     * Omly for Unity 2019.1 and newer!
     * https://forum.unity.com/threads/quit-and-memory-cleanup.571210/
     * @param {Function} callback
     */
    public Quit(onQuitCallback: () => void): void;

    /**
     * Loads JS code blob into the memory.
     * @param url the url to the js blob code
     * @param onLoad on load callback
     */
    public LoadJSCodeBlob(url: string, onLoad: () => void): void;

    /**
     * Loads JS code into the memory.
     * @param url the url to the js code
     * @param onLoad on load callback
     */
    public LoadJSCode(url: string, onLoad: () => void): void;
}
