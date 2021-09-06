import {
    Listbox as FoundationListbox,
    listboxTemplate as template,
} from "@microsoft/fast-foundation";
import { fillColor, neutralLayerFloating } from "../design-tokens";
import { listboxStyles as styles } from "./listbox.styles";

/**
 * The FAST listboxclass
 * @public
 */
export class Listbox extends FoundationListbox {
    /**
     * @internal
     */
    public connectedCallback(): void {
        super.connectedCallback();

        fillColor.setValueFor(this, neutralLayerFloating);
    }
}

/**
 * A function that returns a {@link @microsoft/fast-foundation#Listbox} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#listboxTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: \<fast-listbox\>
 *
 */
export const fastListbox = Listbox.compose({
    baseName: "listbox",
    template,
    styles,
});

/**
 * Styles for Listbox
 * @public
 */
export const listboxStyles = styles;
