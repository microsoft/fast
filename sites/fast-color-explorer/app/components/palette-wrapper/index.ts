import { parseColorHexRGB } from "@microsoft/fast-colors";
import {
    accentPalette,
    neutralPalette,
    PaletteRGB,
    SwatchRGB,
} from "@microsoft/fast-components";
import { attr, html, ViewTemplate } from "@microsoft/fast-element";
import { FoundationElement } from "@microsoft/fast-foundation";

class PaletteWrapper extends FoundationElement {
    @attr({ attribute: "accent-base-color" })
    public accentBaseColor: string;

    @attr({ attribute: "neutral-base-color" })
    public neutralBaseColor: string;

    private accentBaseColorChanged(): void {
        this.updateAccentPalette();
    }

    private neutralBaseColorChanged(): void {
        this.updateNeutralPalette();
    }

    private updateAccentPalette(): void {
        const base = parseColorHexRGB(this.accentBaseColor)!;
        const accentBase = SwatchRGB.create(base.r, base.g, base.b);
        accentPalette.setValueFor(this, PaletteRGB.create(accentBase));
    }

    private updateNeutralPalette(): void {
        const base = parseColorHexRGB(this.neutralBaseColor)!;
        const neutralBase = SwatchRGB.create(base.r, base.g, base.b);
        neutralPalette.setValueFor(this, PaletteRGB.create(neutralBase));
    }

    public connectedCallback(): void {
        super.connectedCallback();
    }
}

export const sampleAppTemplate: (
    context: any,
    definition: any
) => ViewTemplate<PaletteWrapper> = (context: any, definition: any) => html`
    <slot></slot>
`;

export const paletteWrapper = PaletteWrapper.compose({
    baseName: "palette-wrapper",
    template: sampleAppTemplate,
});
