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

// why this component is different

function template<T extends AdaptiveComponent>(): ElementViewTemplate<T> {
    return html<T>`
        <template
            tabindex="0"
            style="
                --ac-fill-rest: ${x => x.fillRest?.createCSS()};
                --ac-fill-hover: ${x => x.fillHover?.createCSS()};
                --ac-fill-active: ${x => x.fillActive?.createCSS()};
                --ac-fill-focus: ${x => x.fillFocus?.createCSS()};
                --ac-stroke-rest: ${x => x.strokeRest?.createCSS()};
                --ac-stroke-hover: ${x => x.strokeHover?.createCSS()};
                --ac-stroke-active: ${x => x.strokeActive?.createCSS()};
                --ac-stroke-focus: ${x => x.strokeFocus?.createCSS()};
                --ac-foreground-rest: ${x => x.foregroundRest?.createCSS()};
                --ac-foreground-hover: ${x => x.foregroundHover?.createCSS()};
                --ac-foreground-active: ${x => x.foregroundActive?.createCSS()};
                --ac-foreground-focus: ${x => x.foregroundFocus?.createCSS()};
            "
        >
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

    :host {
        background: var(--ac-fill-rest);
        border-color: var(--ac-stroke-rest) !important;
        color: var(--ac-foreground-rest);
    }

    :host(:hover) {
        background: var(--ac-fill-hover);
        border-color: var(--ac-stroke-hover) !important;
        color: var(--ac-foreground-hover);
    }

    :host(:active) {
        background: var(--ac-fill-active);
        border-color: var(--ac-stroke-active) !important;
        color: var(--ac-foreground-active);
    }

    :host(:focus) {
        background: var(--ac-fill-focus);
        border-color: var(--ac-stroke-focus) !important;
        color: var(--ac-foreground-focus);
    }
`;

@customElement({
    name: "app-adaptive-component",
    template: template(),
    styles,
})
export class AdaptiveComponent extends FASTElement {
    @observable
    public fillRest?: CSSDesignToken<Swatch>;

    @observable
    public fillHover?: CSSDesignToken<Swatch>;

    @observable
    public fillActive?: CSSDesignToken<Swatch>;

    @observable
    public fillFocus?: CSSDesignToken<Swatch>;

    @observable
    public strokeRest?: CSSDesignToken<Swatch>;

    @observable
    public strokeHover?: CSSDesignToken<Swatch>;

    @observable
    public strokeActive?: CSSDesignToken<Swatch>;

    @observable
    public strokeFocus?: CSSDesignToken<Swatch>;

    @observable
    public foregroundRest?: CSSDesignToken<Swatch>;

    @observable
    public foregroundHover?: CSSDesignToken<Swatch>;

    @observable
    public foregroundActive?: CSSDesignToken<Swatch>;

    @observable
    public foregroundFocus?: CSSDesignToken<Swatch>;
}
