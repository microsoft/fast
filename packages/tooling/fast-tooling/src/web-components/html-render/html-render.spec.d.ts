import { ViewTemplate } from "@microsoft/fast-element";
import { ElementDefinitionContext } from "@microsoft/fast-foundation";
import { ActivityType, HTMLRenderLayer } from "../html-render-layer/html-render-layer";
declare class ActivityResult {
    activityType: ActivityType;
    datadictionaryId: string;
    constructor(activity: ActivityType, dataid: string);
}
export declare class HTMLRenderLayerTest extends HTMLRenderLayer {
    layerActivityId: string;
    lastActivity: ActivityResult;
    elementActivity(
        layerActivityId: string,
        activityType: ActivityType,
        datadictionaryId: string,
        elementRef: HTMLElement
    ): void;
}
export declare const HTMLRenderLayerNavigationTemplate: (
    context: ElementDefinitionContext
) => ViewTemplate<HTMLRenderLayerTest>;
export {};
