import { html, css, Observable } from "@microsoft/fast-element";
import { FoundationElement } from "@microsoft/fast-foundation";
import {
    DesignToken,
    DesignTokens,
    DesignTokensImpl,
    SimpleDesignTokenImpl,
} from "./design-tokens";
import { DesignUnit } from "./my-design-system";

export class DITest extends FoundationElement {
    @DesignUnit designUnit: DesignToken<number>;
    private designTokens: DesignTokens;

    connectedCallback() {
        this.designTokens = new DesignTokensImpl(this);
        Observable.getNotifier(this.designUnit).subscribe(this, "value");

        this.designTokens.set(
            DesignUnit,
            new SimpleDesignTokenImpl(this.designUnit.value + 2)
        );
    }

    handleChange(source, key) {
        console.log("new value:", source[key]);
    }
}

export const DITestElementDefinition = FoundationElement.configuration({
    baseName: "di-test",
    type: DITest,
    template: html`
        <slot></slot>
    `,
    styles: css`
        :host {
            display: block;
        }
    `,
});
