import { observable } from "@microsoft/fast-element";
import {
    ActivityType,
    HTMLRenderLayer,
    OverlayPosition,
} from "../html-render-layer/html-render-layer";

export class HTMLRenderLayerNavigation extends HTMLRenderLayer {
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

    connectedCallback() {
        super.connectedCallback();

        window.addEventListener("scroll", this.handleWindowChange);
        window.addEventListener("resize", this.handleWindowChange);
    }

    disconnectedCallback() {
        super.disconnectedCallback();

        window.removeEventListener("scroll", this.handleWindowChange);
        window.removeEventListener("resize", this.handleWindowChange);
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

    private handleSelect(dataDictionaryId: string, elementRef: HTMLElement) {
        const title =
            this.schemaDictionary && this.dataDictionary
                ? this.schemaDictionary[this.dataDictionary[0][dataDictionaryId].schemaId]
                      .title
                : null;
        this.clickPosition = this.GetPositionFromElement(elementRef);
        this.clickLayerActive = true;
        this.currElementRef = elementRef;
        this.clickPillContent = title || "Untitled";
        this.hoverLayerActive = false;
    }

    private handleHighlight(dataDictionaryId: string, elementRef: HTMLElement) {
        const title =
            this.schemaDictionary && this.dataDictionary
                ? this.schemaDictionary[this.dataDictionary[0][dataDictionaryId].schemaId]
                      .title
                : null;
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
