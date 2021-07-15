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
import { attr, FASTElement, nullableNumberConverter } from "@microsoft/fast-element";
/**
 * A Wrapper Custom HTML Element.
 *
 * @public
 */
export class Wrapper extends FASTElement {
    constructor() {
        super(...arguments);
        /**
         * The x coord
         * @public
         * @remarks
         * HTML Attribute: x
         */
        this.x = 0;
        /**
         * The y coord
         * @public
         * @remarks
         * HTML Attribute: y
         */
        this.y = 0;
        /**
         * The width
         * @public
         * @remarks
         * HTML Attribute: width
         */
        this.width = 0;
        /**
         * The height
         * @public
         * @remarks
         * HTML Attribute: height
         */
        this.height = 0;
        /**
         * The active state
         * When true, the control shows an outline and
         * indicators around the current component
         * @public
         * @remarks
         * HTML Attribute: active
         */
        this.active = true;
        /**
         * The preselect state
         * When true, the control shows a faded outline and
         * indicators around the preselected component
         * @public
         * @remarks
         * HTML Attribute: preselect
         */
        this.preselect = false;
    }
}
__decorate(
    [attr({ attribute: "dictionary-id" })],
    Wrapper.prototype,
    "dictionaryId",
    void 0
);
__decorate(
    [attr({ converter: nullableNumberConverter })],
    Wrapper.prototype,
    "x",
    void 0
);
__decorate(
    [attr({ converter: nullableNumberConverter })],
    Wrapper.prototype,
    "y",
    void 0
);
__decorate(
    [attr({ converter: nullableNumberConverter })],
    Wrapper.prototype,
    "width",
    void 0
);
__decorate(
    [attr({ converter: nullableNumberConverter })],
    Wrapper.prototype,
    "height",
    void 0
);
__decorate(
    [attr({ attribute: "active", mode: "boolean" })],
    Wrapper.prototype,
    "active",
    void 0
);
__decorate(
    [attr({ attribute: "preselect", mode: "boolean" })],
    Wrapper.prototype,
    "preselect",
    void 0
);
