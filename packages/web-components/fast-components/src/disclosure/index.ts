import { attr, customElement } from "@microsoft/fast-element";
import { Disclosure, DisclosureTemplate as template } from "@microsoft/fast-foundation";
import { DisclosureStyles as styles } from "./disclosure.styles";
/**
 * Types of anchor appearance.
 * @public
 */
export type DisclosureAppearance = "accent" | "lightweight";

/**
 * The FAST Disclosure Element. Implements {@link @microsoft/fast-foundation#Disclosure},
 * {@link @microsoft/fast-foundation#DisclosureTemplate}
 *
 *
 * @public
 * @remarks
 * HTML Element: \<fast-Disclosure\>
 *
 */
@customElement({
    name: "fast-disclosure",
    template,
    styles,
})
export class FASTDisclosure extends Disclosure {
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
        if (this.expanded) {
            this.totalHeight = getCurrentHeight();
            this.hide();
            this.height = getCurrentHeight();
            this.show();
        } else {
            this.height = getCurrentHeight();
            this.show();
            this.totalHeight = getCurrentHeight();
            this.hide();
        }
        this.details.style.setProperty("transition", "height 0.35s");
    }

    get disclosureHeight(): number {
        return this.expanded ? this.totalHeight : this.height;
    }
}

/**
 * Styles for Disclosure
 * @public
 */
export const DisclosureStyles = styles;
