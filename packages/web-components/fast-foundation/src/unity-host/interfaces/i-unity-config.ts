// this is derived from
// "https://github.com/elraccoone/react-unity-webgl"

import { UnityVersion } from "../declarations/unity-version";

export default interface IUnityConfig {
    /**
     * The unique identifier helps you getting the instance
     * of your context from any other class.
     * @type {string}
     */
    id?: string;

    /**
     * Unity Module injection.
     * @type {Object}
     */
    modules?: Object;

    /**
     * You can default your Unity Version. The library may
     * contain future patches for specific Unity versions.
     * It's not needed but is recommended to define a version.
     * @type {UnityVersion}
     */
    unityVersion?: UnityVersion;

    /**
     * Since the Unity canvas itself does not respond to the resizing
     * of it's container we have to manually do this. A width and height
     * of 100% does not seem to work, so we have to fetch it's parent's
     * size to adject the canvas.
     * @type {boolean}
     */
    adjustOnWindowResize?: boolean;
}
