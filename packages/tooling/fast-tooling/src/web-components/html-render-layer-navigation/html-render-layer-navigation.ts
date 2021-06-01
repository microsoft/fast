import { customElement, observable } from "@microsoft/fast-element";
import {
    ActivityType,
    HTMLRenderLayer,
    OverylayPosition,
} from "../html-render-layer/html-render-layer";
import { HTMLRenderLayerNavigationStyles } from "./html-render-layer-navigation.style";
import { HTMLRenderLayerNavigationTemplate } from "./html-render-layer-navigation.template";

@customElement({
    name: "fast-tooling-html-render-layer-navigation",
    template: HTMLRenderLayerNavigationTemplate,
    styles: HTMLRenderLayerNavigationStyles,
})
export class HTMLRenderLayerNavgation extends HTMLRenderLayer {

    public layerActivityId: string = "NavLayer";

    @observable
    public hoverPosition: OverylayPosition = new OverylayPosition(0, 0, 0, 0);

    @observable
    public clickPosition: OverylayPosition = new OverylayPosition(0, 0, 0, 0);

    @observable
    public hoverLayerActive: boolean = false;

    @observable
    public clickLayerActive: boolean = false;

    @observable
    public clickLayerHide: boolean = false;

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
        if (this.clickLayerActive) {
            this.clickLayerHide = true;
            if (this.timeoutRef !== null) {
                window.clearTimeout(this.timeoutRef);
            }
            this.timeoutRef = window.setTimeout(() => {
                this.clickPosition = this.GetPositionFromElement(this.currElementRef);
                this.clickLayerHide = false;
            }, 40);
        }
    };

    private GetPositionFromElement(target: HTMLElement): OverylayPosition {
        const pos: DOMRect = target.getBoundingClientRect();
        return new OverylayPosition(pos.top, pos.left, pos.width, pos.height);
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
        this.currElementRef = null;
        this.clickLayerActive = false;
        this.clickPillContent = "";
    }

    private handleUpdate() {
        if(this.clickLayerActive)
        {
            this.clickPosition = this.GetPositionFromElement(this.currElementRef);
        }
    }

    public elementActivity(
        layerActivityId: string, 
        activityType: ActivityType,
        dataDictionaryId: string,
        elementRef: HTMLElement
    ) {
        if(layerActivityId === this.layerActivityId)
        {
            return;
        }
        switch (activityType) {
            case ActivityType.hover:
                this.handleHighlight(dataDictionaryId, elementRef);
                break;
            case ActivityType.blur:
                this.handleUnHighlight();
                break;
            case ActivityType.click:
                this.handleSelect(dataDictionaryId, elementRef);
                break;
            case ActivityType.clear:
                this.handleClear();
                break;
            case ActivityType.update:
                this.handleUpdate();
        }
    }
}
