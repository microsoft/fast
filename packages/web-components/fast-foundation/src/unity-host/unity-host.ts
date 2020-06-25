// this is derived from
// "https://github.com/elraccoone/react-unity-webgl"

import { attr, DOM, FASTElement, observable } from "@microsoft/fast-element";
import UnityContent from "./unity-content";
import IUnityConfig from "./interfaces/i-unity-config";
import UnityLoaderService from "./services/unity-loader-service";
import "./declarations/unity-loader";

export class UnityHost extends FASTElement {
    @attr
    public buildjsonpath: string;

    @attr
    public unityloaderpath: string;

    @attr
    public targetid: string;

    @observable
    public uniqueId: string = "";

    @observable
    public hostStyle: string = "";

    public hostElement: HTMLElement;

    private unityContent: UnityContent;
    private unityLoaderService: UnityLoaderService;
    private unityConfig: IUnityConfig = {};
    private onWindowResizeBinding: () => void;

    constructor() {
        super();
        this.unityLoaderService = new UnityLoaderService();
    }

    public connectedCallback(): void {
        super.connectedCallback();

        this.onWindowResizeBinding = this.onWindowResize.bind(this);
        this.unityContent = new UnityContent(
            this.buildjsonpath,
            this.unityloaderpath,
            this.unityConfig
        );
        this.unityContent.setComponentInstance(this);
        this.uniqueId = this.targetid;
        this.unityConfig.id = this.uniqueId;

        window.addEventListener("resize", this.onWindowResizeBinding);
        // prettier-ignore
        this.unityLoaderService.append(this.unityContent.unityLoaderJsPath, () => {
          UnityLoader.Error.handler = _message => {
            this.unityContent.triggerUnityEvent("error", _message);
            console.error("Fast Unity Host", _message);
          };
          this.onUnityLoad();
          }
        );

        this.hostStyle = `
            height: 1080px;
            width: 1920px;
        `;
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.unityContent.remove();
        window.removeEventListener("resize", this.onWindowResizeBinding);
    }

    private onUnityLoad(): void {
        this.unityContent.setUnityInstance(
            UnityLoader.instantiate(this.uniqueId, this.unityContent.buildJsonPath, {
                onProgress: this.onProgress.bind(this),
                Module: this.unityContent.unityConfig.modules,
                width: "1080px",
                height: "1920px",
            })
        );
    }

    /**
     * An event that is triggered by the Unity player. This tracks
     * the loading progression of the player. It will send '1' when
     * the loading is completed.
     */
    private onProgress(unityInstance: UnityInstance, progression: number): void {
        this.unityContent.triggerUnityEvent("progress", progression);
        if (progression === 1) this.unityContent.triggerUnityEvent("loaded");
    }

    /**
     * When the window is resized.
     */
    private onWindowResize(): void {
        if (this.unityContent.unityConfig.adjustOnWindowResize === true) {
            this.unityContent.triggerUnityEvent("resized");
            this.adjustCanvasToContainer();
        }
    }

    /**
     * Since the Unity canvas itself does not respond to the resizing
     * of it's container we have to manually do this. A width and height
     * of 100% does not seem to work, so we have to fetch it's parent's
     * size to adject the canvas.
     */
    private adjustCanvasToContainer(): void {
        if (typeof this.hostElement !== "undefined") {
            const _width = this.hostElement.offsetWidth;
            const _height = this.hostElement.offsetHeight;
            const _canvas = this.hostElement.getElementsByTagName("canvas")[0];
            if (typeof _canvas !== "undefined" && _canvas.height !== _height)
                _canvas.height = _height;
            if (typeof _canvas !== "undefined" && _canvas.width !== _width)
                _canvas.width = _width;
        }
    }
}
