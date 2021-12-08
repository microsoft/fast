import {
    Select as FoundationSelect,
    SelectOptions,
    selectTemplate as template,
} from "@microsoft/fast-foundation";
import { fillColor, neutralLayerFloating } from "../design-tokens";
import { selectStyles as styles } from "./select.styles";

/**
 * The FAST select class
 * @public
 */
export class Select extends FoundationSelect {
    /**
     * @internal
     */
    public connectedCallback(): void {
        super.connectedCallback();

        if (this.listbox) {
            fillColor.setValueFor(this.listbox, neutralLayerFloating);
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
 * Generates HTML Element: `<fast-select>`
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
                d="M4.14 6.57A1 1 0 0 1 4.96 5h6.08a1 1 0 0 1 .82 1.57l-2.63 3.79a1.5 1.5 0 0 1-2.46 0L4.14 6.57ZM4.96 6l2.63 3.78c.2.29.62.29.82 0L11.04 6H4.96Z"/>
        </svg>
    `,
});

/**
 * Styles for Select
 * @public
 */
export const selectStyles = styles;
