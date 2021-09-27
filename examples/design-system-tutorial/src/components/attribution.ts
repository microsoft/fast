import { designUnit, neutralForegroundHint } from "@microsoft/fast-components";
import { css, html } from "@microsoft/fast-element";
import { display, FoundationElement } from "@microsoft/fast-foundation";

/**
 * The FAST Web Components don't have an "attribution" component built-in.
 * The code below shows how you can build your own. Basing it on FoundationElement and
 * using the FoundationElement.compose API, you can create a brand new component that
 * has all the features and integrates into Design System registration in the same way as
 * our official FAST components. Notice also how the styles leverage the design tokens
 * and style helpers provided by the existing FAST Web Components.
 *
 * Since this is a simple component, we've chosen to keep all of its source in
 * this single file. For an example of how to organize code for a more complex component,
 * take a look in the card folder.
 *
 * Additionally, because this component has no behavior of its own, but simply provides
 * an easy to re-use block of HTML with associated styles, we do not need to create a
 * unique class. Calling FoundationElement.compose directly will handle that for us when
 * it defines the web component with the platform.
 */

export const fastAttribution = FoundationElement.compose({
    baseName: "attribution",
    template: html`
        <slot name="icon"></slot>
        <slot></slot>
    `,
    styles: css`
        ${display("flex")} ::slotted (*) {
            margin: 0 calc(${designUnit} * 1px);
        }

        :host {
            color: ${neutralForegroundHint};
        }
    `,
});
