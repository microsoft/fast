import {
    attr,
    css,
    ElementViewTemplate,
    FASTElement,
    html,
    nullableNumberConverter,
} from "@microsoft/fast-element";
import {
    DesignToken,
    DesignTokenChangeRecord,
    display,
} from "@microsoft/fast-foundation";
import {
    fillColor,
    layerFillBaseLuminance,
    layerFillFixedBase,
    layerFillFixedMinus1,
    layerFillFixedMinus2,
    layerFillFixedMinus3,
    layerFillFixedMinus4,
    layerFillFixedPlus1,
    layerFillFixedPlus2,
    layerFillFixedPlus3,
    layerFillFixedPlus4,
    layerPalette,
    neutralForegroundRest,
    Swatch,
} from "@microsoft/adaptive-ui";

export class LayerBackground extends FASTElement {
    @attr({ attribute: "base-layer-luminance", converter: nullableNumberConverter })
    public baseLayerLuminance: number = 1;
    private baseLayerLuminanceChanged(prev: number, next: number): void {
        layerFillBaseLuminance.setValueFor(this, this.baseLayerLuminance);
        this.updateBackgroundColor();
    }

    @attr({ attribute: "background-layer-recipe" })
    public backgroundLayerRecipe: string = "Base";
    private backgroundLayerRecipeChanged(prev: string, next: string): void {
        this.updateBackgroundColor();
    }

    private updateBackgroundColor(): void {
        if (!this.$fastController.isConnected) {
            return;
        }

        if (this.backgroundLayerRecipe !== undefined) {
            let swatch: Swatch | null = null;
            switch (this.backgroundLayerRecipe) {
                case "-1":
                    swatch = layerFillFixedMinus1.getValueFor(this);
                    break;
                case "-2":
                    swatch = layerFillFixedMinus2.getValueFor(this);
                    break;
                case "-3":
                    swatch = layerFillFixedMinus3.getValueFor(this);
                    break;
                case "-4":
                    swatch = layerFillFixedMinus4.getValueFor(this);
                    break;
                case "Base":
                    swatch = layerFillFixedBase.getValueFor(this);
                    break;
                case "+1":
                    swatch = layerFillFixedPlus1.getValueFor(this);
                    break;
                case "+2":
                    swatch = layerFillFixedPlus2.getValueFor(this);
                    break;
                case "+3":
                    swatch = layerFillFixedPlus3.getValueFor(this);
                    break;
                case "+4":
                    swatch = layerFillFixedPlus4.getValueFor(this);
                    break;
            }

            if (swatch !== null) {
                fillColor.setValueFor(this, swatch);
            }
        }
    }

    public handleChange(
        token: DesignToken<any>,
        record: DesignTokenChangeRecord<any>
    ): void {
        if (record.target === this && token === layerPalette) {
            this.updateBackgroundColor();
        }
    }

    public connectedCallback(): void {
        super.connectedCallback();

        layerPalette.subscribe(this);

        this.updateBackgroundColor();
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();

        layerPalette.unsubscribe(this);
    }
}

export function layerBackgroundTemplate<T extends LayerBackground>(): ElementViewTemplate<
    T
> {
    return html<T>`
        <slot></slot>
    `;
}

export const layerBackgroundStyles = css`
    ${display("block")} :host {
        background: ${fillColor};
        color: ${neutralForegroundRest};
    }
`;

LayerBackground.define({
    name: "app-layer-background",
    styles: layerBackgroundStyles,
    template: layerBackgroundTemplate(),
});
