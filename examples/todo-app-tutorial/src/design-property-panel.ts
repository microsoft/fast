import {
    FASTElement,
    observable,
    html,
    css,
    customElement,
    ExecutionContext,
} from "@microsoft/fast-element";
import {
    DesignSystemProvider,
    fillColor,
    neutralLayer1,
    PaletteRGB,
    SwatchRGB,
} from "@fluentui/web-components";
import {
    ComponentStateColorPalette,
    parseColor,
    ColorRGBA64,
} from "@microsoft/fast-colors";
import { typography } from "./typography";

function createColorPalette(baseColor: ColorRGBA64) {
    return new ComponentStateColorPalette({
        baseColor,
    }).palette.map(color => color.toStringHexRGB().toUpperCase());
}

function targetValue(ctx: ExecutionContext) {
    return (ctx.event.target! as any).value;
}

const template = html<DesignPropertyPanel>`
    <fluent-card>
        <h2>Design System Properties</h2>
        <div class="row">
            <h4>Corner Radius: ${x => x.provider?.controlCornerRadius}px</h4>
            <fluent-slider
                orientation="horizontal"
                min="0"
                max="50"
                step="1"
                value=${x => x.provider?.controlCornerRadius}
                @change=${(x, c) => (x.provider.controlCornerRadius = targetValue(c))}
            >
                <fluent-slider-label position="0">0px</fluent-slider-label>
                <fluent-slider-label position="50">50px</fluent-slider-label>
            </fluent-slider>
        </div>

        <div class="row">
            <h4>Disabled Opacity: ${x => x.provider?.disabledOpacity}%</h4>
            <fluent-slider
                orientation="horizontal"
                min="0"
                max="1"
                step="0.01"
                value=${x => x.provider?.disabledOpacity}
                @change=${(x, c) =>
                    (x.provider.disabledOpacity = Number(
                        parseFloat(targetValue(c)).toFixed(2)
                    ))}
            >
                <fluent-slider-label position="0">0%</fluent-slider-label>
                <fluent-slider-label position="100">100%</fluent-slider-label>
            </fluent-slider>
        </div>

        <div class="row">
            <h4>Base Layer Luminance: ${x => x.provider?.baseLayerLuminance}</h4>
            <fluent-slider
                orientation="horizontal"
                min="0"
                max="1"
                step="0.01"
                value=${x => x.provider?.baseLayerLuminance}
                @change=${(x, c) => {
                    x.provider.baseLayerLuminance = Number(
                        parseFloat(targetValue(c)).toFixed(2)
                    );
                }}
            >
                <fluent-slider-label position="0">Black</fluent-slider-label>
                <fluent-slider-label position="0.23">Dark</fluent-slider-label>
                <fluent-slider-label position="1">Light</fluent-slider-label>
            </fluent-slider>
        </div>

        <div class="row tight">
            <h4>Accent Color</h4>
            <input
                type="color"
                :value=${x => x.provider?.accentBaseColor}
                @input=${(x, c) => {
                    const { r, g, b } = parseColor(targetValue(c))!;
                    const swatch = SwatchRGB.create(r, g, b);
                    x.provider.accentBaseColor = swatch;
                    x.provider.accentPalette = PaletteRGB.create(swatch);
                }}
            />
        </div>

        <div class="row tight">
            <h4>Design Unit</h4>
            <fluent-text-field
                type="number"
                :value=${x => x.provider?.designUnit}
                @change=${(x, c) => (x.provider.designUnit = targetValue(c))}
            ></fluent-text-field>
        </div>

        <div class="row tight">
            <h4>Outline Width</h4>
            <fluent-text-field
                type="number"
                :value=${x => x.provider?.strokeWidth}
                @input=${(x, c) => (x.provider.strokeWidth = targetValue(c))}
            ></fluent-text-field>
        </div>
    </fluent-card>
`;

const styles = css`
    ${typography} :host {
        position: fixed;
        top: 0px;
        right: 0px;
        z-index: 999;
        height: 100%;
    }

    fluent-card {
        --card-width: 300px;
        border-radius: 0px;
        padding: 4px 16px;
    }

    h2 {
        margin-bottom: 16px;
    }

    .row {
        margin-bottom: 48px;
    }

    .tight {
        margin-bottom: 16px;
    }
`;

@customElement({
    name: "design-property-panel",
    template,
    styles,
})
export class DesignPropertyPanel extends FASTElement {
    @observable provider!: DesignSystemProvider;

    providerChanged() {
        fillColor.setValueFor(this.provider, neutralLayer1);
        this.provider.style.setProperty(
            "background-color",
            `var(--${neutralLayer1.name})`
        );
        this.provider.baseLayerLuminance = 1;
    }

    connectedCallback() {
        super.connectedCallback();
        this.provider = this.parentElement as DesignSystemProvider;
    }
}
