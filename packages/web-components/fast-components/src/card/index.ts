import { customElement } from "@microsoft/fast-element";
import { attr, Notifier, Observable } from "@microsoft/fast-element";
import {
    designSystemProperty,
    DesignSystemProvider,
    Card,
    CardTemplate as template,
} from "@microsoft/fast-foundation";
import { CardStyles as styles } from "./card.styles";
import { parseColorHexRGB } from "@microsoft/fast-colors";
import { createColorPalette, FASTDesignSystem, neutralFillCard } from "../index";

const paletteCache = new Map();

/**
 * The FAST Card Element. Implements {@link @microsoft/fast-foundation#Card},
 * {@link @microsoft/fast-foundation#CardTemplate}
 *
 *
 * @public
 * @remarks
 * HTML Element: \<fast-card\>
 */
@customElement({
    name: "fast-card",
    template,
    styles,
})
export class FASTCard extends DesignSystemProvider
    implements Pick<FASTDesignSystem, "backgroundColor" | "neutralPalette"> {
    /**
     * @internal
     * @remarks
     * HTML Attribute: background-color
     */
    @designSystemProperty({
        attribute: false,
        cssCustomProperty: "background-color",
        default: "#FFFFFF",
    })
    public backgroundColor: string;

    /**
     * Background color for the card component. Sets context for the design system.
     * @public
     * @remarks
     * HTML Attribute: card-background-color
     */
    @attr({
        attribute: "card-background-color",
    })
    public cardBackgroundColor: string;
    private cardBackgroundColorChanged(prev: string | void, next: string | void): void {
        if (next) {
            const parsedColor = parseColorHexRGB(this.cardBackgroundColor);

            if (parsedColor !== null) {
                if (paletteCache.has(parsedColor)) {
                    this.neutralPalette = paletteCache.get(parsedColor);
                } else {
                    const neutralPalette = createColorPalette(parsedColor);
                    paletteCache.set(parsedColor, neutralPalette);
                    this.neutralPalette = neutralPalette;
                }
                this.backgroundColor = this.cardBackgroundColor;
            }
        } else if (this.provider && this.provider.designSystem) {
            this.handleChange(
                this.provider.designSystem as FASTDesignSystem,
                "backgroundColor"
            );
        }
    }

    /**
     * Neutral pallette for the the design system provider.
     * @internal
     */
    @designSystemProperty({
        attribute: false,
        default: createColorPalette(parseColorHexRGB("#FFFFFF")!),
        cssCustomProperty: false,
    })
    public neutralPalette: string[];

    /**
     * @internal
     */
    public handleChange(source: FASTDesignSystem, name: string): void {
        if (!this.cardBackgroundColor) {
            this.backgroundColor = neutralFillCard(source);
        }
    }

    connectedCallback(): void {
        super.connectedCallback();
        const parentDSNotifier: Notifier = Observable.getNotifier(
            this.provider?.designSystem
        );
        parentDSNotifier.subscribe(this, "backgroundColor");
        parentDSNotifier.subscribe(this, "neutralPalette");
        this.handleChange(
            this.provider?.designSystem as FASTDesignSystem,
            "backgroundColor"
        );
    }
}

/**
 * Styles for Card
 * @public
 */
export const CardStyles = styles;
