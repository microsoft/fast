import {
    ActivityType,
    HTMLRenderLayer,
    OverlayPosition,
} from "../html-render-layer/html-render-layer";
export declare class HTMLRenderLayerNavigation extends HTMLRenderLayer {
    layerActivityId: string;
    hoverPosition: OverlayPosition;
    clickPosition: OverlayPosition;
    hoverLayerActive: boolean;
    clickLayerActive: boolean;
    clickLayerHide: boolean;
    hoverLayerHide: boolean;
    clickPillContent: string;
    hoverPillContent: string;
    private timeoutRef;
    private currElementRef;
    connectedCallback(): void;
    disconnectedCallback(): void;
    private handleWindowChange;
    private GetPositionFromElement;
    private handleSelect;
    private handleHighlight;
    private handleUnHighlight;
    private handleClear;
    private handleUpdate;
    elementActivity(
        layerActivityId: string,
        activityType: ActivityType,
        dataDictionaryId: string,
        elementRef: Node
    ): void;
}
