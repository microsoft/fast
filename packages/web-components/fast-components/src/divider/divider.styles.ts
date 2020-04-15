import { css } from "@microsoft/fast-element";
import { display } from "../styles";
import { CustomPropertyBehavior } from "../custom-properties";
import { findProvider } from "../design-system-consumer";

export const DividerStyles = css`
    ${display("block")} :host {
        box-sizing: content-box;
        height: 0;
        margin: calc(var(--design-unit) * 1px) 0;
        border: none;
        border-top: calc(var(--outline-width) * 1px) solid var(--neutral-divider-rest);
    }
`.withBehaviors(
    new CustomPropertyBehavior("test-custom-property", () => "bar", findProvider as any)
);

// class RecipeFactory
