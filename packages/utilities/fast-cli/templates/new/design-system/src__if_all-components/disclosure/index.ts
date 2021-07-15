import { attr } from "@microsoft/fast-element";
import {
    Disclosure as FoundationDisclosure,
    disclosureTemplate as template,
} from "@microsoft/fast-foundation";
import { disclosureStyles as styles } from "./disclosure.styles";
/**
 * Types of anchor appearance.
 * @public
 */
export type DisclosureAppearance = "accent" | "lightweight";

/**
 * @internal
 */
export class Disclosure extends FoundationDisclosure {
    /**
     * Disclosure default height
     */
    private height: number;
    /**
     * Disclosure height after it's expanded
     */
    private totalHeight: number;

    /**
     * The appearance the anchor should have.
     *
     * @public
     * @remarks
     * HTML Attribute: appearance
     */
    @attr
    public appearance: DisclosureAppearance;
    public appearanceChanged(
        oldValue: DisclosureAppearance,
        newValue: DisclosureAppearance
    ): void {
        if (oldValue !== newValue) {
            this.classList.add(newValue);
            this.classList.remove(oldValue);
        }
    }

    /**
     * Set disclosure height while transitioning
     * @override
     */
    protected onToggle() {
        super.onToggle();
        this.details.style.setProperty("height", `${this.disclosureHeight}px`);
    }

    /**
     * Calculate disclosure height before and after expanded
     * @override
     */
    protected setup() {
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

    get disclosureHeight(): number {
        return this.expanded ? this.totalHeight : this.height;
    }
}

/**
 * Styles for Disclosure
 * @public
 */
export const disclosureStyles = styles;

/**
 * A function that returns a Disclosure registration for configuring the component with a DesignSystem.
 * Implements Disclosure
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: \</* @echo namespace */-Disclosure\>
 *
 */
export const /* @echo namespace */Disclosure = Disclosure.compose({
    baseName: "disclosure",
    template,
    styles,
});
