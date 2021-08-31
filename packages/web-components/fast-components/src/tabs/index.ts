import {
    Tabs as FoundationTabs,
    tabsTemplate as template,
} from "@microsoft/fast-foundation";
import { fillColor, neutralLayerFloating } from "../design-tokens";
import { tabsStyles as styles } from "./tabs.styles";

/**
 * The FAST tabs class
 * @public
 */
export class Tabs extends FoundationTabs {
    /**
     * @internal
     */
    public connectedCallback(): void {
        super.connectedCallback();

        fillColor.setValueFor(this, neutralLayerFloating);
    }
}

/**
 * A function that returns a {@link @microsoft/fast-foundation#Tabs} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#tabsTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: \<fast-tabs\>
 */
export const fastTabs = Tabs.compose({
    baseName: "tabs",
    template,
    styles,
});

export * from "../tab";
export * from "../tab-panel";
/**
 * Styles for Tabs
 * @public
 */
export const tabsStyles = styles;
