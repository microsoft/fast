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
    public hoverClassName: string = "";

    @observable
    public clickClassName: string = "";

    @observable
    public clickPillContent: string = "";

    @observable
    public hoverPillContent: string = "";

    protected handleMessageSystem(e: MessageEvent): void {
        super.handleMessageSystem(e);
    }

    private GetPositionFromElement(target: HTMLElement): OverylayPosition {
        const pos: DOMRectList = target.getClientRects();
        return new OverylayPosition(pos[0].top, pos[0].left, pos[0].width, pos[0].height);
    }

    private handleSelect(datadictionaryid: string, elementRef: HTMLElement) {
        this.clickPosition = this.GetPositionFromElement(elementRef);
        this.clickClassName = "active";
        this.clickPillContent = datadictionaryid;
        this.hoverClassName = "";
    }

    private handleHighlight(datadictionaryid: string, elementRef: HTMLElement) {
        this.hoverPosition = this.GetPositionFromElement(elementRef);
        this.hoverPillContent = datadictionaryid;
        this.hoverClassName = "active";
    }
    private handleUnHighlight() {
        this.hoverClassName = "";
        this.hoverPillContent = "";
    }

    private handleClear() {
        this.clickClassName = "";
        this.clickPillContent = "";
    }

    public elementActivity(
        activityType: ActivityType,
        datadictionaryid: string,
        elementRef: HTMLElement
    ) {
        switch (activityType) {
            case ActivityType.hover:
                this.handleHighlight(datadictionaryid, elementRef);
                break;
            case ActivityType.blur:
                this.handleUnHighlight();
                break;
            case ActivityType.click:
                this.handleSelect(datadictionaryid, elementRef);
                break;
            case ActivityType.clear:
                this.handleClear();
                break;
        }
    }
}
