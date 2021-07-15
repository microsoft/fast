import {
    ActivityType,
    HTMLRenderLayer,
    OverlayPosition,
} from "../html-render-layer/html-render-layer";
export declare class HTMLRenderLayerInlineEdit extends HTMLRenderLayer {
    layerActivityId: string;
    textAreaActive: boolean;
    textPosition: OverlayPosition;
    textValue: string;
    textAreaRef: HTMLTextAreaElement;
    private currentDataId;
    private originalTextValue;
    private currentStyleTarget;
    private currentTextNode;
    connectedCallback(): void;
    disconnectedCallback(): void;
    private handleWindowChange;
    handleKeyDown(e: KeyboardEvent): boolean;
    handleTextInput(e: KeyboardEvent): boolean;
    handleBlur(e: InputEvent): void;
    private getPositionFromElement;
    private applySizeAndPositionToTextbox;
    private applyStylesToTextbox;
    private startEdit;
    private commitEdit;
    private cancelEdit;
    elementActivity(
        layerActivityId: string,
        activityType: ActivityType,
        datadictionaryId: string,
        elementRef: Node,
        event: Event
    ): void;
}
/**
 *
 * @public
 * @remarks
 * HTML Element: \<html-render-layer-navigation\>
 */
export declare const fastToolingHTMLRenderLayerInlineEdit: (
    overrideDefinition?: import("@microsoft/fast-foundation").OverrideFoundationElementDefinition<{
        baseName: string;
        template: import("@microsoft/fast-element").ViewTemplate<
            HTMLRenderLayerInlineEdit,
            any
        >;
        styles: import("@microsoft/fast-element").ElementStyles;
    }>
) => import("@microsoft/fast-foundation").FoundationElementRegistry<
    {
        baseName: string;
        template: import("@microsoft/fast-element").ViewTemplate<
            HTMLRenderLayerInlineEdit,
            any
        >;
        styles: import("@microsoft/fast-element").ElementStyles;
    },
    typeof HTMLRenderLayerInlineEdit
>;
