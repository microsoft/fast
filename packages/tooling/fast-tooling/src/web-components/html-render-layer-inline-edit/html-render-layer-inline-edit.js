var __decorate =
    (this && this.__decorate) ||
    function (decorators, target, key, desc) {
        var c = arguments.length,
            r =
                c < 3
                    ? target
                    : desc === null
                    ? (desc = Object.getOwnPropertyDescriptor(target, key))
                    : desc,
            d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if ((d = decorators[i]))
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
import { observable } from "@microsoft/fast-element";
import { MessageSystemDataTypeAction, MessageSystemType } from "../../message-system";
import {
    ActivityType,
    HTMLRenderLayer,
    OverlayPosition,
} from "../html-render-layer/html-render-layer";
import { HTMLRenderOriginatorId } from "../html-render/html-render";
import { HTMLRenderLayerInlineEditStyles as styles } from "./html-render-layer-inline-edit.style";
import { HTMLRenderLayerInlineEditTemplate as template } from "./html-render-layer-inline-edit.template";
export class HTMLRenderLayerInlineEdit extends HTMLRenderLayer {
    constructor() {
        super(...arguments);
        this.layerActivityId = "InlineEditLayer";
        this.textAreaActive = false;
        this.textPosition = new OverlayPosition(0, 0, 0, 0);
        this.textValue = "";
        this.currentDataId = null;
        this.originalTextValue = null;
        this.handleWindowChange = () => {
            if (this.textAreaActive) {
                this.applySizeAndPositionToTextbox();
            }
        };
    }
    connectedCallback() {
        super.connectedCallback();
        window.addEventListener("scroll", this.handleWindowChange);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener("scroll", this.handleWindowChange);
    }
    handleKeyDown(e) {
        if (e.key.length === 1) {
            this.currentTextNode.textContent += e.key;
            this.applySizeAndPositionToTextbox();
        }
        return true;
    }
    handleTextInput(e) {
        if (e.key === "Enter") {
            this.commitEdit();
            e.preventDefault();
            return false;
        } else if (e.key === "Escape") {
            this.cancelEdit();
            e.preventDefault();
            return false;
        }
        const inputVal = e.composedPath()[0].value;
        this.currentTextNode.textContent = inputVal;
        this.applySizeAndPositionToTextbox();
        if (this.activityCallback) {
            this.activityCallback(this.layerActivityId, ActivityType.update);
        }
    }
    handleBlur(e) {
        this.cancelEdit();
    }
    getPositionFromElement(target) {
        const range = document.createRange();
        range.selectNode(target);
        const pos = range.getBoundingClientRect();
        return new OverlayPosition(pos.top, pos.left, pos.width, pos.height);
    }
    applySizeAndPositionToTextbox() {
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
    applyStylesToTextbox() {
        const styles = window.getComputedStyle(this.currentStyleTarget);
        this.textAreaRef.style.font = styles.font;
        this.textAreaRef.style.fontWeight = styles.fontWeight;
        this.textAreaRef.style.lineHeight = styles.lineHeight;
    }
    startEdit(datadictionaryId, elementRef, event) {
        if (this.currentDataId === datadictionaryId) {
            this.cancelEdit();
        }
        if (this.activityCallback) {
            this.activityCallback(this.layerActivityId, ActivityType.takeFocus);
        }
        this.currentDataId = datadictionaryId;
        this.currentTextNode = elementRef;
        this.textValue = this.dataDictionary[0][datadictionaryId].data;
        this.originalTextValue = this.textValue;
        const path = event.composedPath();
        let i = 0;
        this.currentStyleTarget = path[i];
        // walk up the composedPath until we find an element that isn't a text node, document fragment or a slot.
        while (
            this.currentStyleTarget.nodeType === 3 ||
            this.currentStyleTarget.nodeType === 11 ||
            this.currentStyleTarget.nodeName === "SLOT"
        ) {
            i++;
            this.currentStyleTarget = path[i];
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
    commitEdit() {
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
                originatorId: HTMLRenderOriginatorId,
            },
        });
        this.currentDataId = null;
        this.currentTextNode = null;
        if (this.activityCallback) {
            this.activityCallback(this.layerActivityId, ActivityType.releaseFocus);
        }
    }
    cancelEdit() {
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
    elementActivity(layerActivityId, activityType, datadictionaryId, elementRef, event) {
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
                this.startEdit(datadictionaryId, elementRef, event);
                break;
        }
    }
}
__decorate([observable], HTMLRenderLayerInlineEdit.prototype, "textAreaActive", void 0);
__decorate([observable], HTMLRenderLayerInlineEdit.prototype, "textPosition", void 0);
__decorate([observable], HTMLRenderLayerInlineEdit.prototype, "textValue", void 0);
/**
 *
 * @public
 * @remarks
 * HTML Element: \<html-render-layer-navigation\>
 */
export const fastToolingHTMLRenderLayerInlineEdit = HTMLRenderLayerInlineEdit.compose({
    baseName: "html-render-layer-inline-edit",
    template,
    styles,
});
