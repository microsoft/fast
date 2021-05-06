import { customElement, observable } from "@microsoft/fast-element";
import { ActivityType, HTMLRenderLayer } from "../html-render-layer/html-render-layer";
import { HTMLRenderLayerNavigationStyles } from "./html-render-layer-navigation.style";
import { HTMLRenderLayerNavigationTemplate } from "./html-render-layer-navigation.template";

class OverylayPosition {
    public top: number;
    public left: number;
    public width: number;
    public height: number;

    constructor(top: number, left: number, width: number, height: number) {
        this.top = top;
        this.left = left;
        this.width = width;
        this.height = height;
    }
}

@customElement({
    name: "fast-tooling-html-render-layer-navigation",
    template: HTMLRenderLayerNavigationTemplate,
    styles: HTMLRenderLayerNavigationStyles,
})
export class HTMLRenderLayerNavgation extends HTMLRenderLayer {
    @observable
    public hoverPosition: OverylayPosition = new OverylayPosition(0, 0, 0, 0);

    @observable
    public clickPosition: OverylayPosition = new OverylayPosition(0, 0, 0, 0);

    @observable
    public hoverLayerActive: boolean = false;

    @observable
    public clickLayerActive: boolean = false;

    @observable
    public clickPillContent: string = "";

    @observable
    public hoverPillContent: string = "";

    private GetPositionFromElement(target: HTMLElement): OverylayPosition {
        const pos: DOMRectList = target.getClientRects();
        return new OverylayPosition(pos[0].top, pos[0].left, pos[0].width, pos[0].height);
    }

    private handleSelect(dataDictionaryId: string, elementRef: HTMLElement) {
        const title =
            this.schemaDictionary && this.dataDictionary
                ? this.schemaDictionary[this.dataDictionary[0][dataDictionaryId].schemaId]
                      .title
                : null;
        this.clickPosition = this.GetPositionFromElement(elementRef);
        this.clickLayerActive = true;
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
        this.clickPillContent = "";
    }

    public elementActivity(
        activityType: ActivityType,
        dataDictionaryId: string,
        elementRef: HTMLElement
    ) {
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
        }
    }
}
