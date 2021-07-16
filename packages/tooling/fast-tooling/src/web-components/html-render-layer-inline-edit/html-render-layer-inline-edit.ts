import { observable } from "@microsoft/fast-element";
import { MessageSystemDataTypeAction, MessageSystemType } from "../../message-system";
import {
    ActivityType,
    HTMLRenderLayer,
    OverlayPosition,
} from "../html-render-layer/html-render-layer";
import { htmlRenderOriginatorId } from "../html-render/html-render";

export class HTMLRenderLayerInlineEdit extends HTMLRenderLayer {
    public layerActivityId: string = "InlineEditLayer";

    @observable
    public textAreaActive: boolean = false;

    @observable
    public textPosition: OverlayPosition = new OverlayPosition(0, 0, 0, 0);

    @observable
    public textValue: string = "";

    public textAreaRef: HTMLTextAreaElement;

    private currentDataId: string = null;
    private originalTextValue: string = null;
    private currentStyleTarget: HTMLElement;
    private currentTextNode: Node;

    connectedCallback() {
        super.connectedCallback();

        window.addEventListener("scroll", this.handleWindowChange);
    }

    disconnectedCallback() {
        super.disconnectedCallback();

        window.removeEventListener("scroll", this.handleWindowChange);
    }

    private handleWindowChange = () => {
        if (this.textAreaActive) {
            this.applySizeAndPositionToTextbox();
        }
    };

    public handleKeyDown(e: KeyboardEvent) {
        if (e.key.length === 1) {
            this.currentTextNode.textContent += e.key;
            this.applySizeAndPositionToTextbox();
        }
        return true;
    }

    public handleTextInput(e: KeyboardEvent) {
        if (e.key === "Enter") {
            this.commitEdit();
            e.preventDefault();
            return false;
        } else if (e.key === "Escape") {
            this.cancelEdit();
            e.preventDefault();
            return false;
        }
        const inputVal = (e.composedPath()[0] as HTMLInputElement).value;
        this.currentTextNode.textContent = inputVal;
        this.applySizeAndPositionToTextbox();
        if (this.activityCallback) {
            this.activityCallback(this.layerActivityId, ActivityType.update);
        }
    }

    public handleBlur(e: InputEvent) {
        this.cancelEdit();
    }

    private getPositionFromElement(target: Node): OverlayPosition {
        const range = document.createRange();
        range.selectNode(target);
        const pos: DOMRect = range.getBoundingClientRect();
        return new OverlayPosition(pos.top, pos.left, pos.width, pos.height);
    }

    private applySizeAndPositionToTextbox() {
        this.textPosition = this.getPositionFromElement(this.currentTextNode);
        this.textAreaRef.style.top = `${this.textPosition.top}px`;
        this.textAreaRef.style.left = `${this.textPosition.left}px`;
        this.textAreaRef.style.width = "0";
        this.textAreaRef.style.height = "0";
        this.textAreaRef.style.width = `${
            this.textAreaRef.scrollWidth > this.textPosition.width
                ? this.textAreaRef.scrollWidth
                : this.textPosition.width
        }px`;
        this.textAreaRef.style.height = `${
            this.textAreaRef.scrollHeight > this.textPosition.height
                ? this.textAreaRef.scrollHeight
                : this.textPosition.height
        }px`;
    }

    private applyStylesToTextbox() {
        const styles: CSSStyleDeclaration = window.getComputedStyle(
            this.currentStyleTarget
        );
        this.textAreaRef.style.font = styles.font;
        this.textAreaRef.style.fontWeight = styles.fontWeight;
        this.textAreaRef.style.lineHeight = styles.lineHeight;
    }

    private startEdit(datadictionaryId: string, elementRef: Node, event: MouseEvent) {
        if (this.currentDataId === datadictionaryId) {
            this.cancelEdit();
        }
        if (this.activityCallback) {
            this.activityCallback(this.layerActivityId, ActivityType.takeFocus);
        }

        this.currentDataId = datadictionaryId;
        this.currentTextNode = elementRef;

        this.textValue = this.dataDictionary[0][datadictionaryId].data as string;
        this.originalTextValue = this.textValue;
        const path: EventTarget[] = event.composedPath();
        let i = 0;
        this.currentStyleTarget = path[i] as HTMLElement;
        // walk up the composedPath until we find an element that isn't a text node, document fragment or a slot.
        while (
            this.currentStyleTarget.nodeType === 3 ||
            this.currentStyleTarget.nodeType === 11 ||
            this.currentStyleTarget.nodeName === "SLOT"
        ) {
            i++;
            this.currentStyleTarget = path[i] as HTMLElement;
        }
        // position, style and show the textarea
        this.applyStylesToTextbox();
        this.applySizeAndPositionToTextbox();
        this.textAreaActive = true;

        // give the dom time to update and show the textarea before giving it focus
        window.setTimeout(() => {
            this.textAreaRef.focus();
        }, 10);
    }

    private commitEdit() {
        const newValue = this.textAreaRef.value.replaceAll("\n", "");
        this.textAreaActive = false;
        this.textValue = "";
        this.originalTextValue = "";

        // send the data update message
        this.messageSystem.postMessage({
            type: MessageSystemType.data,
            action: MessageSystemDataTypeAction.update,
            dataLocation: "",
            data: newValue,
            options: {
                originatorId: htmlRenderOriginatorId,
            },
        });
        this.currentDataId = null;
        this.currentTextNode = null;
        if (this.activityCallback) {
            this.activityCallback(this.layerActivityId, ActivityType.releaseFocus);
        }
    }

    private cancelEdit() {
        // reset all changes
        if (this.currentTextNode) {
            this.currentTextNode.textContent = this.originalTextValue;
        }
        this.textAreaActive = false;
        this.currentDataId = null;
        this.currentTextNode = null;
        this.textValue = "";
        this.originalTextValue = "";
        if (this.activityCallback) {
            this.activityCallback(this.layerActivityId, ActivityType.update);
            this.activityCallback(this.layerActivityId, ActivityType.releaseFocus);
        }
    }

    // Handle element activity events from the HTMLRender component
    public elementActivity(
        layerActivityId: string,
        activityType: ActivityType,
        datadictionaryId: string,
        elementRef: Node,
        event: Event
    ) {
        if (layerActivityId === this.layerActivityId) {
            return;
        }
        switch (activityType) {
            case ActivityType.click:
                if (
                    this.currentDataId !== null &&
                    this.currentDataId !== datadictionaryId
                ) {
                    // currently editing and something else was clicked
                    this.cancelEdit();
                }
                break;
            case ActivityType.clear:
                if (this.currentDataId !== null) {
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
