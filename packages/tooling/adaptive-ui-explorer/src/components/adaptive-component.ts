import {
    css,
    customElement,
    ElementViewTemplate,
    FASTElement,
    html,
    observable,
} from "@microsoft/fast-element";
import { CSSDesignToken } from "@microsoft/fast-foundation";
import { Swatch } from "@microsoft/adaptive-ui";

function template<T extends AdaptiveComponent>(): ElementViewTemplate<T> {
    return html<T>`
        <template tabindex="0">
            <style>
                :host {
                    background: ${x => x.fillRestToken?.createCSS()};
                    border-color: ${x => x.strokeRestToken?.createCSS()} !important;
                    color: ${x => x.foregroundRestToken?.createCSS()};
                }

                :host(:hover) {
                    background: ${x => x.fillHoverToken?.createCSS()};
                    border-color: ${x => x.strokeHoverToken?.createCSS()} !important;
                    color: ${x => x.foregroundHoverToken?.createCSS()};
                }

                :host(:active) {
                    background: ${x => x.fillActiveToken?.createCSS()};
                    border-color: ${x => x.strokeActiveToken?.createCSS()} !important;
                    color: ${x => x.foregroundActiveToken?.createCSS()};
                }

                :host(:focus) {
                    background: ${x => x.fillFocusToken?.createCSS()};
                    border-color: ${x => x.strokeFocusToken?.createCSS()} !important;
                    color: ${x => x.foregroundFocusToken?.createCSS()};
                }
            </style>
            <slot></slot>
        </template>
    `;
}

const styles = css`
    :host {
        display: flex;
        align-items: center;
        padding: 6px 12px;
        box-sizing: border-box;
        font-size: 14px;
        justify-items: start;
        border: 1px solid transparent;
        border-radius: 4px;
        cursor: pointer;
    }
`;

@customElement({
    name: "app-adaptive-component",
    template: template(),
    styles,
})
export class AdaptiveComponent extends FASTElement {
    @observable
    public fillRestToken?: CSSDesignToken<Swatch>;

    @observable
    public fillHoverToken?: CSSDesignToken<Swatch>;

    @observable
    public fillActiveToken?: CSSDesignToken<Swatch>;

    @observable
    public fillFocusToken?: CSSDesignToken<Swatch>;

    @observable
    public strokeRestToken?: CSSDesignToken<Swatch>;

    @observable
    public strokeHoverToken?: CSSDesignToken<Swatch>;

    @observable
    public strokeActiveToken?: CSSDesignToken<Swatch>;

    @observable
    public strokeFocusToken?: CSSDesignToken<Swatch>;

    @observable
    public foregroundRestToken?: CSSDesignToken<Swatch>;

    @observable
    public foregroundHoverToken?: CSSDesignToken<Swatch>;

    @observable
    public foregroundActiveToken?: CSSDesignToken<Swatch>;

    @observable
    public foregroundFocusToken?: CSSDesignToken<Swatch>;
}
