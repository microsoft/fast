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
                d="M3.44 6.72a.83.83 0 0 1 .63-1.39h7.86c.72 0 1.1.85.63 1.39l-3.68 4.2c-.47.53-1.3.53-1.76 0l-3.68-4.2Zm1-.39 3.43 3.93c.07.08.19.08.26 0l3.43-3.93H4.44Z"
            />
        </svg>
    `,
});

/**
 * Styles for Select
 * @public
 */
export const selectStyles = styles;
