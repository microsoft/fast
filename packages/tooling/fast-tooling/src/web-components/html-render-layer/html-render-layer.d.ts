import { FoundationElement } from "@microsoft/fast-foundation";
import { DataDictionary, MessageSystem, SchemaDictionary } from "../../message-system";
export declare enum ActivityType {
    hover = "hover",
    blur = "blur",
    click = "click",
    clear = "clear",
    doubleClick = "dblclick",
    update = "update",
    takeFocus = "takeFocus",
    releaseFocus = "release",
}
export declare class OverlayPosition {
    top: number;
    left: number;
    width: number;
    height: number;
    constructor(top: number, left: number, width: number, height: number);
}
export interface HTMLRenderLayerCallbackType {
    (layerActivityId: string, activityType: ActivityType): void;
}
export declare abstract class HTMLRenderLayer extends FoundationElement {
    dataDictionary: DataDictionary<unknown>;
    schemaDictionary: SchemaDictionary;
    activityCallback: HTMLRenderLayerCallbackType;
    abstract layerActivityId: string;
    messageSystem: MessageSystem;
    private messageSystemChanged;
    protected handleMessageSystem: (e: MessageEvent) => void;
    abstract elementActivity(
        layerActivityId: string,
        activityType: ActivityType,
        datadictionaryId: string,
        elementRef: Node,
        event: Event
    ): any;
}
