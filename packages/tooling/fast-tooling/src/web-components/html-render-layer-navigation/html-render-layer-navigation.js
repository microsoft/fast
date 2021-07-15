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
import {
    ActivityType,
    HTMLRenderLayer,
    OverlayPosition,
} from "../html-render-layer/html-render-layer";
export class HTMLRenderLayerNavigation extends HTMLRenderLayer {
    constructor() {
        super(...arguments);
        this.layerActivityId = "NavLayer";
        this.hoverPosition = new OverlayPosition(0, 0, 0, 0);
        this.clickPosition = new OverlayPosition(0, 0, 0, 0);
        this.hoverLayerActive = false;
        this.clickLayerActive = false;
        this.clickLayerHide = false;
        this.hoverLayerHide = false;
        this.clickPillContent = "";
        this.hoverPillContent = "";
        this.timeoutRef = null;
        this.currElementRef = null;
        this.handleWindowChange = () => {
            if (this.hoverLayerActive) {
                this.handleUnHighlight();
            }
            if (this.clickLayerActive && this.currElementRef !== null) {
                this.clickLayerHide = true;
                if (this.timeoutRef !== null) {
                    window.clearTimeout(this.timeoutRef);
                }
                this.timeoutRef = window.setTimeout(() => {
                    if (this.clickLayerActive && this.currElementRef !== null) {
                        this.clickPosition = this.GetPositionFromElement(
                            this.currElementRef
                        );
                    }
                    this.clickLayerHide = false;
                }, 40);
            }
        };
    }
    connectedCallback() {
        super.connectedCallback();
        window.addEventListener("scroll", this.handleWindowChange);
        window.addEventListener("resize", this.handleWindowChange);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener("scroll", this.handleWindowChange);
        window.removeEventListener("resize", this.handleWindowChange);
    }
    GetPositionFromElement(target) {
        const pos = target.getBoundingClientRect();
        return new OverlayPosition(pos.top, pos.left, pos.width, pos.height);
    }
    handleSelect(dataDictionaryId, elementRef) {
        const title =
            this.schemaDictionary && this.dataDictionary
                ? this.schemaDictionary[this.dataDictionary[0][dataDictionaryId].schemaId]
                      .title
                : null;
        this.clickPosition = this.GetPositionFromElement(elementRef);
        this.clickLayerActive = true;
        this.currElementRef = elementRef;
        this.clickPillContent = title || "Untitled";
        this.hoverLayerActive = false;
    }
    handleHighlight(dataDictionaryId, elementRef) {
        const title =
            this.schemaDictionary && this.dataDictionary
                ? this.schemaDictionary[this.dataDictionary[0][dataDictionaryId].schemaId]
                      .title
                : null;
        this.hoverPosition = this.GetPositionFromElement(elementRef);
        this.hoverPillContent = title || "Untitled";
        this.hoverLayerActive = true;
    }
    handleUnHighlight() {
        this.hoverLayerActive = false;
        this.hoverPillContent = "";
    }
    handleClear() {
        this.clickLayerActive = false;
        this.currElementRef = null;
        this.clickLayerActive = false;
        this.clickPillContent = "";
    }
    handleUpdate() {
        if (this.clickLayerActive) {
            this.clickPosition = this.GetPositionFromElement(this.currElementRef);
        }
    }
    elementActivity(layerActivityId, activityType, dataDictionaryId, elementRef) {
        if (layerActivityId === this.layerActivityId) {
            return;
        }
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
            case ActivityType.update:
                this.handleUpdate();
                break;
            case ActivityType.takeFocus:
                this.hoverLayerHide = true;
                break;
            case ActivityType.releaseFocus:
                this.hoverLayerHide = false;
                break;
        }
    }
}
__decorate([observable], HTMLRenderLayerNavigation.prototype, "hoverPosition", void 0);
__decorate([observable], HTMLRenderLayerNavigation.prototype, "clickPosition", void 0);
__decorate([observable], HTMLRenderLayerNavigation.prototype, "hoverLayerActive", void 0);
__decorate([observable], HTMLRenderLayerNavigation.prototype, "clickLayerActive", void 0);
__decorate([observable], HTMLRenderLayerNavigation.prototype, "clickLayerHide", void 0);
__decorate([observable], HTMLRenderLayerNavigation.prototype, "hoverLayerHide", void 0);
__decorate([observable], HTMLRenderLayerNavigation.prototype, "clickPillContent", void 0);
__decorate([observable], HTMLRenderLayerNavigation.prototype, "hoverPillContent", void 0);
