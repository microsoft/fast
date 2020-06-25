// this is derived from
// "https://github.com/elraccoone/react-unity-webgl"

export default interface IUnityEvent {
    /**
     * The events name. It will be triggered by the name.
     * @type {string}
     */
    eventName: string;

    /**
     * The events callback. This event will be triggered
     * when the
     * @type {Function}
     */
    eventCallback: Function;
}
