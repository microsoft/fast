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
import { attr } from "@microsoft/fast-element";
import {
    Anchor as FoundationAnchor,
    anchorTemplate as template,
} from "@microsoft/fast-foundation";
import { anchorStyles as styles } from "./anchor.styles";
/**
 * Base class for Anchor
 * @public
 */
export class Anchor extends FoundationAnchor {
    appearanceChanged(oldValue, newValue) {
        if (oldValue !== newValue) {
            this.classList.add(newValue);
            this.classList.remove(oldValue);
        }
    }
    connectedCallback() {
        super.connectedCallback();
        if (!this.appearance) {
            this.appearance = "neutral";
        }
    }
    /**
     * Applies 'icon-only' class when there is only an SVG in the default slot
     *
     * @internal
     *
     */
    defaultSlottedContentChanged(oldValue, newValue) {
        const slottedElements = this.defaultSlottedContent.filter(
            x => x.nodeType === Node.ELEMENT_NODE
        );
        if (slottedElements.length === 1 && slottedElements[0] instanceof SVGElement) {
            this.control.classList.add("icon-only");
        } else {
            this.control.classList.remove("icon-only");
        }
    }
}
__decorate([attr], Anchor.prototype, "appearance", void 0);
/**
 * Styles for Anchor
 * @public
 */
export const anchorStyles = styles;
/**
 * A function that returns a {@link @microsoft/fast-foundation#Anchor} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#anchorTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: \<fast-anchor\>
 *
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot/delegatesFocus | delegatesFocus}
 */
export const fastAnchor = Anchor.compose({
    baseName: "anchor",
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true,
    },
});
