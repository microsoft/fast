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
import {
    FASTElement,
    observable,
    html,
    css,
    customElement,
} from "@microsoft/fast-element";
import { neutralLayerL1Behavior, parseColorString } from "@fluentui/web-components";
import { ComponentStateColorPalette } from "@microsoft/fast-colors";
import { typography } from "./typography";
function createColorPalette(baseColor) {
    return new ComponentStateColorPalette({
        baseColor,
    }).palette.map(color => color.toStringHexRGB().toUpperCase());
}
function targetValue(ctx) {
    return ctx.event.target.value;
}
const template = html`
    <fluent-card>
        <h2>Design System Properties</h2>
        <div class="row">
            <h4>
                Corner Radius:
                ${x => {
                    var _a;
                    return (_a = x.provider) === null || _a === void 0
                        ? void 0
                        : _a.cornerRadius;
                }}px
            </h4>
            <fluent-slider
                orientation="horizontal"
                min="0"
                max="50"
                step="1"
                :value=${x => {
                    var _a;
                    return (_a = x.provider) === null || _a === void 0
                        ? void 0
                        : _a.cornerRadius;
                }}
                @change=${(x, c) => (x.provider.cornerRadius = targetValue(c))}
            >
                <fluent-slider-label position="0">0px</fluent-slider-label>
                <fluent-slider-label position="50">50px</fluent-slider-label>
            </fluent-slider>
        </div>

        <div class="row">
            <h4>
                Disabled Opacity:
                ${x => {
                    var _a;
                    return (_a = x.provider) === null || _a === void 0
                        ? void 0
                        : _a.disabledOpacity;
                }}%
            </h4>
            <fluent-slider
                orientation="horizontal"
                min="0"
                max="1"
                step="0.01"
                :value=${x => {
                    var _a;
                    return (_a = x.provider) === null || _a === void 0
                        ? void 0
                        : _a.disabledOpacity;
                }}
                @change=${(x, c) =>
                    (x.provider.disabledOpacity = parseFloat(targetValue(c)).toFixed(2))}
            >
                <fluent-slider-label position="0">0%</fluent-slider-label>
                <fluent-slider-label position="100">100%</fluent-slider-label>
            </fluent-slider>
        </div>

        <div class="row">
            <h4>
                Base Layer Luminance:
                ${x => {
                    var _a;
                    return (_a = x.provider) === null || _a === void 0
                        ? void 0
                        : _a.baseLayerLuminance;
                }}
            </h4>
            <fluent-slider
                orientation="horizontal"
                min="0"
                max="1"
                step="0.01"
                :value=${x => {
                    var _a;
                    return parseFloat(
                        (_a = x.provider) === null || _a === void 0
                            ? void 0
                            : _a.baseLayerLuminance
                    );
                }}
                @change=${(x, c) => {
                    x.provider.backgroundColor = neutralLayerL1Behavior.value({
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
                :value=${x => {
                    var _a;
                    return (_a = x.provider) === null || _a === void 0
                        ? void 0
                        : _a.accentBaseColor;
                }}
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
                :value=${x => {
                    var _a;
                    return (_a = x.provider) === null || _a === void 0
                        ? void 0
                        : _a.designUnit;
                }}
                @change=${(x, c) => (x.provider.designUnit = targetValue(c))}
            ></fluent-text-field>
        </div>

        <div class="row tight">
            <h4>Outline Width</h4>
            <fluent-text-field
                type="number"
                :value=${x => {
                    var _a;
                    return (_a = x.provider) === null || _a === void 0
                        ? void 0
                        : _a.outlineWidth;
                }}
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
let DesignPropertyPanel = class DesignPropertyPanel extends FASTElement {
    providerChanged() {
        this.provider.registerCSSCustomProperty(neutralLayerL1Behavior);
        this.provider.style.setProperty(
            "background-color",
            `var(--${neutralLayerL1Behavior.name})`
        );
        this.provider.backgroundColor = neutralLayerL1Behavior.value(
            this.provider.designSystem
        );
        this.provider.baseLayerLuminance = 1;
    }
    connectedCallback() {
        super.connectedCallback();
        this.provider = this.parentElement;
    }
};
__decorate([observable], DesignPropertyPanel.prototype, "provider", void 0);
DesignPropertyPanel = __decorate(
    [
        customElement({
            name: "design-property-panel",
            template,
            styles,
        }),
    ],
    DesignPropertyPanel
);
export { DesignPropertyPanel };
