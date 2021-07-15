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
    Disclosure as FoundationDisclosure,
    disclosureTemplate as template,
} from "@microsoft/fast-foundation";
import { disclosureStyles as styles } from "./disclosure.styles";
/**
 * @internal
 */
export class Disclosure extends FoundationDisclosure {
    appearanceChanged(oldValue, newValue) {
        if (oldValue !== newValue) {
            this.classList.add(newValue);
            this.classList.remove(oldValue);
        }
    }
    /**
     * Set disclosure height while transitioning
     * @override
     */
    onToggle() {
        super.onToggle();
        this.details.style.setProperty("height", `${this.disclosureHeight}px`);
    }
    /**
     * Calculate disclosure height before and after expanded
     * @override
     */
    setup() {
        super.setup();
        if (!this.appearance) {
            this.appearance = "accent";
        }
        const getCurrentHeight = () => this.details.getBoundingClientRect().height;
        this.show();
        this.totalHeight = getCurrentHeight();
        this.hide();
        this.height = getCurrentHeight();
        if (this.expanded) {
            this.show();
        }
    }
    get disclosureHeight() {
        return this.expanded ? this.totalHeight : this.height;
    }
}
__decorate([attr], Disclosure.prototype, "appearance", void 0);
/**
 * Styles for Disclosure
 * @public
 */
export const disclosureStyles = styles;
/**
 * A function that returns a {@link @microsoft/fast-foundation#Disclosure} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#disclosureTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: \<fast-Disclosure\>
 *
 */
export const fastDisclosure = Disclosure.compose({
    baseName: "disclosure",
    template,
    styles,
});
