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
import { FoundationElement } from "@microsoft/fast-foundation";
import { MessageSystemType } from "../../message-system";
export var ActivityType;
(function (ActivityType) {
    ActivityType["hover"] = "hover";
    ActivityType["blur"] = "blur";
    ActivityType["click"] = "click";
    ActivityType["clear"] = "clear";
    ActivityType["doubleClick"] = "dblclick";
    ActivityType["update"] = "update";
    ActivityType["takeFocus"] = "takeFocus";
    ActivityType["releaseFocus"] = "release";
})(ActivityType || (ActivityType = {}));
export class OverlayPosition {
    constructor(top, left, width, height) {
        this.top = top;
        this.left = left;
        this.width = width;
        this.height = height;
    }
}
export class HTMLRenderLayer extends FoundationElement {
    constructor() {
        super(...arguments);
        this.activityCallback = null;
        this.handleMessageSystem = e => {
            if (e.data) {
                if (
                    e.data.type === MessageSystemType.initialize ||
                    e.data.type === MessageSystemType.data
                ) {
                    this.dataDictionary = e.data.dataDictionary;
                    this.schemaDictionary = e.data.schemaDictionary;
                }
                if (e.data.type === MessageSystemType.schemaDictionary) {
                    this.schemaDictionary = e.data.schemaDictionary;
                }
            }
        };
    }
    messageSystemChanged() {
        if (this.messageSystem !== undefined) {
            this.messageSystem.add({ onMessage: this.handleMessageSystem });
        }
    }
}
__decorate([observable], HTMLRenderLayer.prototype, "messageSystem", void 0);
