import { attr, observable } from "@microsoft/fast-element";
import { dataSetName } from "../../message-system/message-system.utilities";
import {
    ActivityType,
    HTMLRenderLayer,
    OverlayPosition,
} from "../html-render-layer/html-render-layer";
import type {
    ConstructibleResizeObserver,
    ResizeObserverClassDefinition,
} from "./resize-observer";

// TODO: the Resize Observer related files are a temporary stopgap measure until
// the package's Typescript version is upgraded to the latest version.
// At that point these files should be deleted.
declare global {
    interface WindowWithResizeObserver extends Window {
        ResizeObserver: ConstructibleResizeObserver;
    }
}

export class HTMLRenderLayerNavigation extends HTMLRenderLayer {
    /**
     * Specifies a query selector string for choosing the element to attach
     * the resize observer to. Defaults to document.body if not supplied.
     * document.querySelector is used to find the element so the resizeobserverselector
     * should be specific enough to return only one element, otherwise only the first match
     * will be used.
     */
    @attr
    public resizeobserverselector: string;

    public layerActivityId: string = "NavLayer";

    @observable
    public hoverPosition: OverlayPosition = new OverlayPosition(0, 0, 0, 0);

    @observable
    public clickPosition: OverlayPosition = new OverlayPosition(0, 0, 0, 0);

    @observable
    public hoverLayerActive: boolean = false;

    @observable
    public clickLayerActive: boolean = false;

    @observable
    public clickLayerHide: boolean = false;

    @observable
    public hoverLayerHide: boolean = false;

    @observable
    public clickPillContent: string = "";

    @observable
    public hoverPillContent: string = "";

    private timeoutRef: number = null;
    private currElementRef: HTMLElement = null;

    //TODO: Replace with vanila ResizeObserver after Typscript is upgraded to at least v4.2.3.
    private resizeDetector: ResizeObserverClassDefinition | null = null;

    connectedCallback() {
        super.connectedCallback();

        this.resizeDetector = new ((window as unknown) as WindowWithResizeObserver).ResizeObserver(
            this.handleWindowChange
        );

        this.resizeDetector.observe(
            (this.resizeobserverselector
                ? (this.getRootNode() as Element).querySelector(
                      this.resizeobserverselector
                  )
                : null) ?? document.body
        );

        window.addEventListener("scroll", this.handleWindowChange);
        window.addEventListener("resize", this.handleWindowChange);
    }

    disconnectedCallback() {
        super.disconnectedCallback();

        window.removeEventListener("scroll", this.handleWindowChange);
        window.removeEventListener("resize", this.handleWindowChange);
        this.resizeDetector.disconnect();
        this.resizeDetector = null;
    }

    private handleWindowChange = () => {
        if (this.hoverLayerActive) {
            this.handleUnHighlight();
        }
        if (this.clickLayerActive && this.currElementRef !== null) {
            this.clickLayerHide = true;
            if (this.timeoutRef !== null) {
                window.clearTimeout(this.timeoutRef);
            }
            this.timeoutRef = window.setTimeout(() => {
                if (this.clickLayerActive && this.currElementRef !== null) {
                    this.clickPosition = this.GetPositionFromElement(this.currElementRef);
                }
                this.clickLayerHide = false;
            }, 40);
        }
    };

    private GetPositionFromElement(target: HTMLElement): OverlayPosition {
        const pos: DOMRect = target.getBoundingClientRect();
        return new OverlayPosition(pos.top, pos.left, pos.width, pos.height);
    }

    private getTitleForDictionaryId(dataDictionaryId): string | null {
        const dataDictionaryEntry = this.dataDictionary?.[0][dataDictionaryId];
        return (
            dataDictionaryEntry.data[dataSetName] ??
            this.schemaDictionary?.[dataDictionaryEntry.schemaId].title ??
            null
        );
    }

    private handleSelect(dataDictionaryId: string, elementRef: HTMLElement) {
        const title = this.getTitleForDictionaryId(dataDictionaryId);
        this.clickPosition = this.GetPositionFromElement(elementRef);
        this.clickLayerActive = true;
        this.currElementRef = elementRef;
        this.clickPillContent = title || "Untitled";
        this.hoverLayerActive = false;
    }

    private handleHighlight(dataDictionaryId: string, elementRef: HTMLElement) {
        const title = this.getTitleForDictionaryId(dataDictionaryId);
        this.hoverPosition = this.GetPositionFromElement(elementRef);
        this.hoverPillContent = title || "Untitled";
        this.hoverLayerActive = true;
    }
    private handleUnHighlight() {
        this.hoverLayerActive = false;
        this.hoverPillContent = "";
    }

    private handleClear() {
        this.clickLayerActive = false;
        this.currElementRef = null;
        this.clickLayerActive = false;
        this.clickPillContent = "";
    }

    private handleUpdate() {
        if (this.clickLayerActive) {
            this.clickPosition = this.GetPositionFromElement(this.currElementRef);
        }
    }

    public elementActivity(
        layerActivityId: string,
        activityType: ActivityType,
        dataDictionaryId: string,
        elementRef: Node
    ) {
        if (layerActivityId === this.layerActivityId) {
            return;
        }

        switch (activityType) {
            case ActivityType.hover:
                this.handleHighlight(dataDictionaryId, elementRef as HTMLElement);
                break;
            case ActivityType.blur:
                this.handleUnHighlight();
                break;
            case ActivityType.click:
                this.handleSelect(dataDictionaryId, elementRef as HTMLElement);
                break;
            case ActivityType.clear:
                this.handleClear();
                break;
            case ActivityType.update:
                this.handleUpdate();
                break;
            case ActivityType.takeFocus:
                this.hoverLayerHide = true;
                break;
            case ActivityType.releaseFocus:
                this.hoverLayerHide = false;
                break;
        }
    }
}
