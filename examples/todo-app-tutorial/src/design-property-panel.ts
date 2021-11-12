import {
    FASTElement,
    observable,
    html,
    css,
    customElement,
    ExecutionContext,
} from "@microsoft/fast-element";
import {
    accentPalette,
    baseLayerLuminance,
    controlCornerRadius,
    DesignSystemProvider,
    designUnit,
    disabledOpacity,
    fillColor,
    neutralLayer1,
    neutralLayer1Recipe,
    Palette,
    PaletteRGB,
    strokeWidth,
    SwatchRGB,
} from "@fluentui/web-components";
import { parseColor } from "@microsoft/fast-colors";
import { typography } from "./typography";
import { DesignToken, DesignTokenValue } from "@microsoft/fast-foundation";

function targetValue(ctx: ExecutionContext) {
    return (ctx.event.target! as any).value;
}

const template = html<DesignPropertyPanel>`
    <fluent-card>
        <h2>Design System Properties</h2>
        <div class="row">
            <h4>Corner Radius: ${x => x.controlCornerRadius}px</h4>
            <fluent-slider
                orientation="horizontal"
                min="0"
                max="50"
                step="1"
                value=${x => x.controlCornerRadius}
                @change=${(x, c) => (x.controlCornerRadius = targetValue(c))}
            >
                <fluent-slider-label position="0">0px</fluent-slider-label>
                <fluent-slider-label position="50">50px</fluent-slider-label>
            </fluent-slider>
        </div>

        <div class="row">
            <h4>Disabled Opacity: ${x => x.disabledOpacity}%</h4>
            <fluent-slider
                orientation="horizontal"
                min="0"
                max="1"
                step="0.01"
                value=${x => x.disabledOpacity}
                @change=${(x, c) =>
                    (x.disabledOpacity = Number(parseFloat(targetValue(c)).toFixed(2)))}
            >
                <fluent-slider-label position="0">0%</fluent-slider-label>
                <fluent-slider-label position="100">100%</fluent-slider-label>
            </fluent-slider>
        </div>

        <div class="row">
            <h4>Base Layer Luminance: ${x => x.baseLayerLuminance}</h4>
            <fluent-slider
                orientation="horizontal"
                min="0"
                max="1"
                step="0.01"
                value=${x => x.baseLayerLuminance}
                @change=${(x, c) => {
                    x.baseLayerLuminance = Number(parseFloat(targetValue(c)).toFixed(2));
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
                :value=${x => x.accentPalette?.source.toColorString()}
                @input=${(x, c) => {
                    const { r, g, b } = parseColor(targetValue(c))!;
                    const swatch = SwatchRGB.create(r, g, b);
                    x.accentPalette = PaletteRGB.create(swatch);
                }}
            />
        </div>

        <div class="row tight">
            <h4>Design Unit</h4>
            <fluent-text-field
                type="number"
                :value=${x => x.designUnit}
                @change=${(x, c) => (x.designUnit = targetValue(c))}
            ></fluent-text-field>
        </div>

        <div class="row tight">
            <h4>Outline Width</h4>
            <fluent-text-field
                type="number"
                :value=${x => x.strokeWidth}
                @input=${(x, c) => (x.strokeWidth = targetValue(c))}
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
function designToken<T>(token: DesignToken<T>) {
    return (source: DesignPropertyPanel, key: string): void => {
        (source as any)[key + "Changed"] = function (
            this: DesignPropertyPanel,
            prev: T | undefined,
            next: T | undefined
        ): void {
            if (prev !== undefined && next !== undefined && next !== null) {
                token.setValueFor(this.app, next as DesignTokenValue<T>);
            } else if (next === undefined) {
                token.deleteValueFor(this.app);
            }
        };
    };
}

@customElement({
    name: "design-property-panel",
    template,
    styles,
})
export class DesignPropertyPanel extends FASTElement {
    @observable app!: HTMLElement;

    @observable
    baseLayerLuminance: number | undefined;
    baseLayerLuminanceChanged(prev: number | undefined, next: number): void {
        if (prev === undefined) {
            return;
        }

        baseLayerLuminance.setValueFor(this.app, next);
        // work around for deep dependency hierarchy bug in DesignToken.
        // TODO: Change to fillColor.setValueFor(this.app, neutralLayerL1) https://github.com/microsoft/fast/pull/5056
        fillColor.setValueFor(
            this.app,
            neutralLayer1Recipe.getValueFor(this.app).evaluate(this.app)
        );
    }

    @designToken(controlCornerRadius)
    @observable
    controlCornerRadius: number | undefined;

    @designToken(disabledOpacity)
    @observable
    disabledOpacity: number | undefined;

    @designToken(accentPalette)
    @observable
    accentPalette: Palette | undefined;

    @designToken(designUnit)
    @observable
    designUnit: number | undefined;

    @designToken(strokeWidth)
    @observable
    strokeWidth: number | undefined;

    connectedCallback(): void {
        this.baseLayerLuminance = baseLayerLuminance.getValueFor(this);
        this.controlCornerRadius = controlCornerRadius.getValueFor(this);
        this.disabledOpacity = disabledOpacity.getValueFor(this);
        this.accentPalette = accentPalette.getValueFor(this);
        this.designUnit = designUnit.getValueFor(this);
        this.strokeWidth = strokeWidth.getValueFor(this);
        this.app = document.querySelector("todo-app") as HTMLElement;

        super.connectedCallback();
    }
}
