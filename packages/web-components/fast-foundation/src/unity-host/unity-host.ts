// this is derived from
// "https://github.com/elraccoone/react-unity-webgl"

import { attr, DOM, FASTElement, observable } from "@microsoft/fast-element";
import UnityContent from "./unity-content";
import IUnityConfig from "./interfaces/i-unity-config";
import UnityLoaderService from "./services/unity-loader-service";
import "./declarations/unity-loader";
// TODO: the Resize Observer related files are a temporary stopgap measure until
// Resize Observer types are pulled into TypeScript, which seems imminent
// At that point these files should be deleted.
// https://github.com/microsoft/TypeScript/issues/37861
import {
    ConstructibleResizeObserver,
    ResizeObserverClassDefinition,
} from "../anchored-region/resize-observer";
import { ResizeObserverEntry } from "../anchored-region/resize-observer-entry";

export class UnityHost extends FASTElement {
    @attr
    public buildjsonpath: string;

    @attr
    public unityloaderpath: string;

    @attr
    public targetid: string;

    @attr({ attribute: "content-enabled", mode: "boolean" })
    public contentEnabled: boolean;
    private contentEnabledChanged(): void {
        // todo: disableing not covered yet
        if (this.contentEnabled && !this.isInitialized) {
            this.initialize();
        }
    }

    @observable
    public uniqueId: string = "";

    @observable
    public hostStyle: string = "";

    @observable
    public contentLoaded: boolean = false;

    @observable
    public loadProgress: number = 0;

    public hostElement: HTMLElement;

    private unityContent: UnityContent;
    private unityLoaderService: UnityLoaderService;
    private unityConfig: IUnityConfig = {};

    private resizeDetector: ResizeObserverClassDefinition;

    private isInitialized: boolean = false;

    constructor() {
        super();
        this.unityLoaderService = new UnityLoaderService();
    }

    public connectedCallback(): void {
        super.connectedCallback();

        this.unityContent = new UnityContent(
            this.buildjsonpath,
            this.unityloaderpath,
            this.unityConfig
        );
        this.unityContent.setComponentInstance(this);
        this.uniqueId = this.targetid;
        this.unityConfig.adjustOnWindowResize = true;
        this.unityConfig.id = this.uniqueId;

        this.unityContent.on("ShowMessage", (message: string) => {});

        this.unityContent.on("progress", (progression: number) => {
            this.loadProgress = progression;
            // todo: event
        });

        this.unityContent.on("loaded", () => {
            this.contentLoaded = true;
            // todo: event
        });

        this.unityContent.on("AddButton", (buttonParams: any) => {
            this.contentLoaded = true;
            // todo: event
        });

        this.hostStyle = `
            height: 100%;
            width: 100%;
        `;

        this.resizeDetector = new ((window as unknown) as WindowWithResizeObserver).ResizeObserver(
            this.handleResize
        );
        this.resizeDetector.observe(this.hostElement);

        if (this.contentEnabled !== false) {
            this.initialize();
        }
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.unityContent.remove();
        if (this.resizeDetector) {
            this.resizeDetector.disconnect();
        }
    }

    // todo: constrain (convert?) param types
    public messageUnity = (
        targetGameObject: string,
        targetFunction: string,
        param: any
    ): void => {
        if (this.unityContent === null) {
            return;
        }
        this.unityContent.send(targetGameObject, targetFunction, param);
    };

    public subscribeEvent = (eventName: string, callback: Function): void => {
        if (this.unityContent === null) {
            return;
        }
        this.unityContent.on(eventName, callback);
    };

    public unsubscribeEvent = (eventName: string, callback: Function): void => {
        if (this.unityContent === null) {
            return;
        }
        // todo: unsubscribe? cleanup?
    };

    private initialize = (): void => {
        if (this.isInitialized) {
            return;
        }
        // prettier-ignore
        this.unityLoaderService.append(this.unityContent.unityLoaderJsPath, () => {
            UnityLoader.Error.handler = _message => {
                this.unityContent.triggerUnityEvent("error", _message);
                console.error("Fast Unity Host", _message);
            };
            this.onUnityLoad();
        });

        this.isInitialized = true;
    };

    private onUnityLoad = (): void => {
        this.unityContent.setUnityInstance(
            UnityLoader.instantiate(this.uniqueId, this.unityContent.buildJsonPath, {
                onProgress: this.onProgress.bind(this),
                Module: this.unityContent.unityConfig.modules,
                width: this.hostElement.clientWidth,
                height: this.hostElement.clientHeight,
            })
        );
    };

    /**
     * An event that is triggered by the Unity player. This tracks
     * the loading progression of the player. It will send '1' when
     * the loading is completed.
     */
    private onProgress = (unityInstance: UnityInstance, progression: number): void => {
        this.unityContent.triggerUnityEvent("progress", progression);
        if (progression === 1) this.unityContent.triggerUnityEvent("loaded");
    };

    /**
     *  Handle resize events
     */
    private handleResize = (entries: ResizeObserverEntry[]): void => {
        entries.forEach((entry: ResizeObserverEntry) => {
            if (entry.target === this.hostElement) {
                this.unityContent.triggerUnityEvent("resized");
                this.adjustCanvasToContainer();
            }
        });
    };

    /**
     * Since the Unity canvas itself does not respond to the resizing
     * of it's container we have to manually do this. A width and height
     * of 100% does not seem to work, so we have to fetch it's parent's
     * size to adject the canvas.
     */
    private adjustCanvasToContainer = (): void => {
        if (typeof this.hostElement !== "undefined") {
            const _width = this.hostElement.offsetWidth;
            const _height = this.hostElement.offsetHeight;
            const _canvas = this.hostElement.getElementsByTagName("canvas")[0];
            if (typeof _canvas !== "undefined" && _canvas.height !== _height)
                _canvas.height = _height;
            if (typeof _canvas !== "undefined" && _canvas.width !== _width)
                _canvas.width = _width;
        }
    };
}
