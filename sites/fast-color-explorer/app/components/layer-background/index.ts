import {
    baseLayerLuminance,
    fillColor,
    neutralLayer1,
    neutralLayer2,
    neutralLayer3,
    neutralLayer4,
    neutralPalette,
    Swatch,
} from "@microsoft/fast-components";
import { attr, css, html, ViewTemplate } from "@microsoft/fast-element";
import {
    DesignToken,
    DesignTokenChangeRecord,
    display,
    FoundationElement,
} from "@microsoft/fast-foundation";

class LayerBackground extends FoundationElement {
    @attr({ attribute: "base-layer-luminance" })
    public baseLayerLuminance: number;

    @attr({ attribute: "background-layer-recipe" })
    public backgroundLayerRecipe: string;

    private baseLayerLuminanceChanged(): void {
        baseLayerLuminance.setValueFor(this, this.baseLayerLuminance);
        this.updateBackgroundColor();
    }

    private backgroundLayerRecipeChanged(): void {
        this.updateBackgroundColor();
    }

    private updateBackgroundColor(): void {
        if (!this.$fastController.isConnected) {
            return;
        }

        if (this.backgroundLayerRecipe !== undefined) {
            const palette = neutralPalette.getValueFor(this);
            const lum = baseLayerLuminance.getValueFor(this);
            let swatch: Swatch | null = null;
            switch (this.backgroundLayerRecipe) {
                case "L1":
                    swatch = neutralLayer1.getValueFor(this);
                    break;
                case "L2":
                    swatch = neutralLayer2.getValueFor(this);
                    break;
                case "L3":
                    swatch = neutralLayer3.getValueFor(this);
                    break;
                case "L4":
                    swatch = neutralLayer4.getValueFor(this);
                    break;
            }

            if (swatch !== null) {
                fillColor.setValueFor(this, swatch);
            }
        }
    }

    public handleChange(record: DesignTokenChangeRecord<DesignToken<any>>): void {
        if (record.token === neutralPalette) {
            this.updateBackgroundColor();
        }
    }

    public connectedCallback(): void {
        super.connectedCallback();

        neutralPalette.subscribe(this);

        this.updateBackgroundColor();
    }
}

export const layerBackgroundTemplate: (
    context: any,
    definition: any
) => ViewTemplate<LayerBackground> = (context: any, definition: any) => html`
    <slot></slot>
`;

export const layerBackgroundStyles = css`
    ${display("block")} :host {
        background: ${fillColor};
    }
`;

export const layerBackground = LayerBackground.compose({
    baseName: "layer-background",
    template: layerBackgroundTemplate,
    styles: layerBackgroundStyles,
});
