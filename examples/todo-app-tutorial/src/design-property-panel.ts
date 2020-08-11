import {
    FASTElement,
    observable,
    html,
    css,
    customElement,
    ExecutionContext,
} from "@microsoft/fast-element";
import { neutralLayerL1Behavior, parseColorString } from "@fluentui/web-components";
import { ComponentStateColorPalette, ColorRGBA64 } from "@microsoft/fast-colors";
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
            <h4>Corner Radius: ${x => x.provider?.cornerRadius}px</h4>
            <fluent-slider
                orientation="horizontal"
                min="0"
                max="50"
                step="1"
                value=${x => x.provider?.cornerRadius}
                @change=${(x, c) => (x.provider.cornerRadius = targetValue(c))}
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
                    (x.provider.disabledOpacity = parseFloat(targetValue(c)).toFixed(2))}
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
                value=${x => parseFloat(x.provider?.baseLayerLuminance)}
                @change=${(x, c) => {
                    x.provider.backgroundColor = (neutralLayerL1Behavior.value as any)({
                        ...x.provider.designSystem,
                    });
                    x.provider.baseLayerLuminance = parseFloat(targetValue(c)).toFixed(2);
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
                    x.provider.accentBaseColor = targetValue(c);
                    x.provider.accentPalette = createColorPalette(
                        parseColorString(targetValue(c))
                    );
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
                :value=${x => x.provider?.outlineWidth}
                @input=${(x, c) => (x.provider.outlineWidth = targetValue(c))}
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
    @observable provider!: any;
    providerChanged() {
        this.provider.registerCSSCustomProperty(neutralLayerL1Behavior);
        this.provider.style.setProperty(
            "background-color",
            `var(--${neutralLayerL1Behavior.name})`
        );
        this.provider.backgroundColor = (neutralLayerL1Behavior.value as any)(
            this.provider.designSystem
        );
        this.provider.baseLayerLuminance = 1;
    }

    connectedCallback() {
        super.connectedCallback();
        this.provider = this.parentElement;
    }
}
