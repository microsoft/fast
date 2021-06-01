import { customElement, observable } from "@microsoft/fast-element";
import { MessageSystemDataTypeAction, MessageSystemNavigationTypeAction, MessageSystemType } from "../../message-system";;
import { ActivityType, HTMLRenderLayer, OverylayPosition } from "../html-render-layer/html-render-layer";
import { HTMLRenderOriginatorId } from "../html-render/html-render";
import { HTMLRenderLayerInlineEditStyles } from "./html-render-layer-inline-edit.style";
import { HTMLRenderLayerInlineEditTemplate } from "./html-render-layer-inline-edit.template";

@customElement({
    name: "fast-tooling-html-render-layer-inline-edit",
    template: HTMLRenderLayerInlineEditTemplate,
    styles: HTMLRenderLayerInlineEditStyles,
})
export class HTMLRenderLayerInlineEdit extends HTMLRenderLayer {
    public layerActivityId: string = "InlineEditLayer";

    @observable
    public textAreaActive: boolean = false;

    @observable
    public textPosition: OverylayPosition = new OverylayPosition(0, 0, 0, 0);

    @observable 
    public textValue: string = "";

    public textAreaRef: HTMLTextAreaElement;

    private currentDataId: string = null;
    private currentTarget: HTMLElement;
    private originalTextValue: string = null;

    public handleTextInput(e: InputEvent) {
        if(e.inputType === "insertLineBreak")
        {
            this.commitEdit();
            e.preventDefault();
            return false;
        }
        const inputVal = (e.composedPath()[0] as HTMLInputElement).value;
        this.currentTarget.innerText = inputVal;
        this.applySizeAndPositionToTextbox();
        if(this.activityCallback)
        {
            this.activityCallback(this.layerActivityId);
        }
    }

    private GetPositionFromElement(target: HTMLElement): OverylayPosition {
        const pos: DOMRect = target.getBoundingClientRect();
        return new OverylayPosition(pos.top, pos.left, pos.width, pos.height);
    }

    private applySizeAndPositionToTextbox()
    {
        this.textPosition = this.GetPositionFromElement(this.currentTarget);
        this.textAreaRef.style.top = this.textPosition.top + "px";
        this.textAreaRef.style.left = this.textPosition.left + "px";
        this.textAreaRef.style.width = this.textPosition.width + "px";
        this.textAreaRef.style.height = this.textPosition.height + "px";
    }

    private applyStylesToTextbox()
    {
        const styles: CSSStyleDeclaration = window.getComputedStyle(this.currentTarget);
        this.textAreaRef.style.font = styles.font;
        this.textAreaRef.style.fontWeight = styles.fontWeight;
        this.textAreaRef.style.lineHeight = styles.lineHeight;
        this.textAreaRef.style.padding = styles.padding;
    }

    private startEdit(datadictionaryId: string, elementRef: HTMLElement, event: MouseEvent)
    {
        if(this.currentDataId === datadictionaryId)
        {
            this.cancelEdit();
        }
        this.currentDataId = datadictionaryId;
        this.currentTarget = elementRef;
        this.textValue = elementRef.innerText;
        this.originalTextValue = this.textValue;
        // position, style and show the textarea
        this.applyStylesToTextbox();
        this.applySizeAndPositionToTextbox();
        this.textAreaActive = true;
        window.setTimeout(()=>{this.textAreaRef.focus();},10);
    }

    private commitEdit()
    {
        const newValue = this.textAreaRef.value;
        this.textAreaActive = false;
        this.textValue = "";
        // update the data dictionary
        // send the data update message
        this.messageSystem.postMessage({
            type: MessageSystemType.data,
            action: MessageSystemDataTypeAction.update,
            dataLocation: "",
            data: newValue,
            options: {
                originatorId: HTMLRenderOriginatorId,
            },
        });
        this.currentDataId = null;
        this.currentTarget = null;
    }

    private cancelEdit()
    {
        // undo everything
        if(this.currentTarget)
        {
            this.currentTarget.innerText = this.originalTextValue;
        }
        this.textAreaActive = false;
        this.currentDataId = null;
        this.currentTarget = null;
        if(this.activityCallback)
        {
            this.activityCallback(this.layerActivityId);
        }
    }

    public elementActivity(layerActivityId: string, activityType: ActivityType, datadictionaryId: string, elementRef: HTMLElement, event: Event) {
        if(layerActivityId === this.layerActivityId)
        {
            return;
        }
        switch(activityType)
        {
            case ActivityType.click:
                if(this.currentDataId !== null && this.currentDataId !== datadictionaryId)
                {
                    // currently editing and something else was clicked
                    this.cancelEdit();
                }
                break;
            case ActivityType.clear:
                if(this.currentDataId !== null)
                {
                    this.cancelEdit();
                }
                break;
            case ActivityType.doubleClick:
                this.cancelEdit();
                this.startEdit(datadictionaryId, elementRef, event as MouseEvent);
                break;
        }

    }
}