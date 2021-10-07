import {
    fillColor,
    neutralLayer2,
    neutralLayer3,
    neutralLayer4,
    neutralStrokeRest,
    strokeWidth,
} from "@microsoft/fast-components";
import { css, customElement, FASTElement, html } from "@microsoft/fast-element";
import { display } from "@microsoft/fast-foundation";

const template = html`
    <slot></slot>
`;

/**
 * Notice how the styles use design tokens imported from the FAST system.
 * Design tokens can be used anywhere you would use a CSS variable.
 */
const styles = css`
    ${display("block")} :host {
        background-color: ${fillColor};
        border-right: calc(${strokeWidth} * 1px) solid ${neutralStrokeRest};
    }
`;

/**
 * You do not have to use FoundationElement.compose to define components.
 * You can always use the simple decorator syntax. The decorator option is most
 * appropriate for app-specific components because it immediately defines the
 * component with the platform upon import. On the other hand, FoundationElement.compose
 * is better for reusable components, since it delays registration until the app developer
 * specifies it, and also allows the app developer the opportunity to customize the
 * component before it is defined.
 *
 * Note: When using the decorator approach, if your bundler tree-shakes, you will still
 * need to ensure that the component is statically traceable. The easiest way to do this
 * is to import the component and use it. See the main.ts file for how this component was
 * handled.
 */

@customElement({
    name: "demo-navigation",
    template,
    styles,
})
export class Navigation extends FASTElement {
    connectedCallback(): void {
        super.connectedCallback();

        // When this element connects, it will alias the fillColor
        // token to the neutralLayer2 token for this element and its
        // descendants. Because FAST's color system is algorithmic,
        // setting the fill color causes other colors to update. This
        // can be seen when looking at the selected item color in the
        // tree-view that is nested in this navigation panel. Try commenting
        // and uncommenting the line below to see how the navigation changes.
        // Also try switching the value to neutralLayer3 or neutralLayer4.
        fillColor.setValueFor(this, neutralLayer2);
    }
}
