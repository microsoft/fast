import { customElement, observable } from "@microsoft/fast-element";
import { ActivityType, HTMLRenderLayer, OverylayPosition } from "../html-render-layer/html-render-layer";
import { HTMLRenderLayerInlineEditStyles } from "./html-render-layer-inline-edit.style";
import { HTMLRenderLayerInlineEditTemplate } from "./html-render-layer-inline-edit.template";

@customElement({
    name: "fast-tooling-html-render-layer-inline-edit",
    template: HTMLRenderLayerInlineEditTemplate,
    styles: HTMLRenderLayerInlineEditStyles,
})
export class HTMLRenderLayerInlineEdit extends HTMLRenderLayer {

    @observable
    public textAreaActive: boolean = false;

    @observable
    public textPosition: OverylayPosition = new OverylayPosition(0, 0, 0, 0);

    @observable 
    public textValue: string = "";

    public textAreaRef: HTMLTextAreaElement;

    private currentDataId: string;
    private currentTarget: HTMLElement;

    public handleTextInput(e: Event) {
        const inputVal = (e.composedPath()[0] as HTMLInputElement).value;
        this.currentTarget.innerText = inputVal;
        this.applySizeAndPositionToTextbox();
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
        this.textAreaRef.style.color = styles.color;
        this.textAreaRef.style.fontWeight = styles.fontWeight;
        this.textAreaRef.style.lineHeight = styles.lineHeight;
        this.textAreaRef.style.padding = styles.padding;
        this.textAreaRef.style.background = styles.background;
    }

    private startEdit(datadictionaryId: string, elementRef: HTMLElement)
    {
        if(this.currentDataId === datadictionaryId)
        {
            this.commitEdit();
        }
        this.currentDataId = datadictionaryId;
        this.currentTarget = elementRef;
        this.textValue = elementRef.innerText;
        this.textAreaRef.focus();
        // position, style and show the textarea
        this.applyStylesToTextbox();
        this.applySizeAndPositionToTextbox();
        this.currentTarget.style.visibility = "hidden";
        this.textAreaActive = true;
    }

    private commitEdit()
    {
        this.textAreaActive = false;
        if(this.currentTarget)
        {
            this.currentTarget.style.visibility = "visible";
        }

        // update the data dictionary
        // send the data update message

        this.currentDataId = null;
        this.currentTarget = null;
    }

    private cancelEdit()
    {
        // undo everything
        if(this.currentTarget)
        {
            this.currentTarget.style.visibility = "visible";
        }

        this.textAreaActive = false;
        this.currentDataId = null;
        this.currentTarget = null;
    }

    public elementActivity(activityType: ActivityType, datadictionaryId: string, elementRef: HTMLElement) {

        switch(activityType)
        {
            case ActivityType.click:
                console.log("click activity", datadictionaryId);
                if(this.currentDataId !== null && this.currentDataId !== datadictionaryId)
                {
                    // currently editing and something else was clicked
                    // commit the current edit
                    this.commitEdit();
                }
                break;
            case ActivityType.clear:
                console.log("clear activity");
                if(this.currentDataId !== null)
                {
                    this.commitEdit();
                }
                break;
            case ActivityType.doubleClick:
                console.log("dblclick activity", datadictionaryId);
                this.startEdit(datadictionaryId, elementRef);
                break;
        }

    }
}