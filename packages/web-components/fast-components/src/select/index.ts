import {
    Select as FoundationSelect,
    SelectOptions,
    selectTemplate as template,
} from "@microsoft/fast-foundation";
import { fillColor, neutralLayerFloating } from "../design-tokens";
import { selectStyles as styles } from "./select.styles";

/**
 * The FAST select class
 * @internal
 */
export class Select extends FoundationSelect {
    /**
     * @internal
     */
    public connectedCallback(): void {
        super.connectedCallback();

        const listbox = this.closest(".listbox") as HTMLElement;
        if (listbox) {
            fillColor.setValueFor(listbox, neutralLayerFloating);
        }
    }
}

/**
 * The FAST select Custom Element. Implements, {@link @microsoft/fast-foundation#Select}
 * {@link @microsoft/fast-foundation#selectTemplate}
 *
 *
 * @public
 * @remarks
 * Generates HTML Element: \<fast-select\>
 *
 */
export const fastSelect = Select.compose<SelectOptions>({
    baseName: "select",
    template,
    styles,
    indicator: `
    <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M3.44084 6.7154C2.96937 6.1766 3.35203 5.33333 4.06799 5.33333H11.9322C12.6481 5.33333 13.0308 6.1766 12.5593 6.7154L8.87809 10.9225C8.41322 11.4537 7.58689 11.4537 7.12202 10.9225L3.44084 6.7154ZM4.43528 6.33333L7.87462 10.264C7.94102 10.3399 8.05909 10.3399 8.12549 10.264L11.5648 6.33333H4.43528Z"
        />
    </svg>
  `,
});

/**
 * Styles for Select
 * @public
 */
export const selectStyles = styles;
