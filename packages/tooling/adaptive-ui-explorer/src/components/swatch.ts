import { contrastRatio, parseColor } from "@microsoft/fast-colors";
import {
    attr,
    css,
    customElement,
    ElementViewTemplate,
    FASTElement,
    html,
    observable,
} from "@microsoft/fast-element";
import { DesignToken } from "@microsoft/fast-foundation";
import { fillColor, neutralForegroundHint, Swatch } from "@microsoft/adaptive-ui";

export enum SwatchType {
    fill = "fill",
    foreground = "foreground",
    outline = "outline",
}

function template<T extends AppSwatch>(): ElementViewTemplate<T> {
    return html<T>`
        <div
            class="icon"
            style="${x => x.iconStyle}"
            title="${x => x.contrastMessage}"
        ></div>
        <code class="recipe-name">${x => x.recipeName}</code>
        <code class="hex-code">${x => x.colorValue}</code>
    `;
}

const styles = css`
    :host {
        display: grid;
        grid-template-columns: auto 1fr auto;
        grid-template-rows: auto;
        align-items: center;
        width: 100%;
        padding: 4px 0;
        box-sizing: border-box;
        color: ${neutralForegroundHint};
        font-size: 12px;
        grid-column-gap: 16px;
        justify-items: start;
    }

    :host([type="foreground"]) .icon {
        border: 1px solid black;
    }

    :host([type="foreground"]) .icon::before {
        font-size: 13px;
        content: "A";
        font-weight: 400;
    }

    .icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
        border-radius: 2px;
        box-sizing: border-box;
    }

    .recipe-name {
        grid-column: 2;
        grid-row: 1;
    }

    .hex-code {
        grid-column: 3;
        grid-row: 1;
    }
`;

@customElement({
    name: "app-swatch",
    template: template(),
    styles,
})
export class AppSwatch extends FASTElement {
    @attr
    public type: SwatchType;

    @attr({ attribute: "recipe-name" })
    public recipeName: string;

    @observable
    public foregroundRecipe?: DesignToken<Swatch>;
    public foregroundRecipeChanged() {
        this.updateObservables();
    }

    @observable
    public fillRecipe?: DesignToken<Swatch>;
    public fillRecipeChanged() {
        this.updateObservables();
    }

    @observable
    public outlineRecipe?: DesignToken<Swatch>;
    public outlineRecipeChanged() {
        this.updateObservables();
    }

    @observable
    public iconStyle: string;

    @observable
    public contrastMessage: string;

    @observable
    public colorValue: string;

    public connectedCallback() {
        super.connectedCallback();

        fillColor.subscribe(this);

        this.updateObservables();
    }

    public disconnectedCallback() {
        super.disconnectedCallback();

        fillColor.unsubscribe(this);
    }

    public handleChange() {
        this.updateObservables();
    }

    private updateObservables() {
        this.updateIconStyle();
        this.updateContrastMessage();
        this.updateColorValue();
    }

    private tokenCSS(token?: DesignToken<Swatch>): string {
        return token && typeof (token as any).createCSS === "function"
            ? (token as any).createCSS()
            : "";
    }

    private evaluateToken(token?: DesignToken<Swatch>): string {
        return token?.getValueFor(this).toColorString() || "";
    }

    private updateIconStyle(): void {
        const background = `background-color: ${this.tokenCSS(this.fillRecipe)}`;
        this.iconStyle =
            this.type === SwatchType.outline
                ? `border: 4px solid ${this.tokenCSS(this.outlineRecipe)}; ${background}`
                : this.type === SwatchType.foreground
                ? `color: ${this.tokenCSS(this.foregroundRecipe)}; ${background}`
                : background;
    }

    private formatContrast(a?: DesignToken<Swatch>, b?: DesignToken<Swatch>): string {
        return a && b
            ? contrastRatio(
                  parseColor(this.evaluateToken(a))!,
                  parseColor(this.evaluateToken(b))!
              ).toFixed(2)
            : "";
    }

    private formatBackgroundContrast(
        a?: DesignToken<Swatch>,
        b?: DesignToken<Swatch>
    ): string {
        return `BG contrast: ${this.formatContrast(a, b)} : 1`;
    }

    private formatForegroundContrast(
        a?: DesignToken<Swatch>,
        b?: DesignToken<Swatch>
    ): string {
        return `Text contrast: ${this.formatContrast(a, b)} : 1`;
    }

    private updateContrastMessage(): void {
        const backgroundContrastMessage: string = this.formatBackgroundContrast(
            this.type === SwatchType.foreground
                ? this.foregroundRecipe
                : this.type === SwatchType.outline
                ? this.outlineRecipe
                : this.fillRecipe,
            this.type === SwatchType.foreground || this.type === SwatchType.outline
                ? this.fillRecipe
                : fillColor
        );

        this.contrastMessage =
            this.type === SwatchType.fill
                ? backgroundContrastMessage.concat(
                      "\n",
                      this.formatForegroundContrast(
                          this.fillRecipe,
                          this.foregroundRecipe
                      )
                  )
                : backgroundContrastMessage;
    }

    private updateColorValue(): void {
        const recipe =
            this.type === SwatchType.outline
                ? this.outlineRecipe
                : this.type === SwatchType.foreground
                ? this.foregroundRecipe
                : this.fillRecipe;
        this.colorValue = this.evaluateToken(recipe).toUpperCase();
    }
}
