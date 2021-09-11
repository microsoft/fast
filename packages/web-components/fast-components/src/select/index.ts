import {
    DesignToken,
    Select as FoundationSelect,
    SelectOptions,
    selectTemplate as template,
} from "@microsoft/fast-foundation";
import { selectStyles as styles } from "./select.styles";

/**
 * The design token to leverage for the listbox max height value. The
 * max height token value is set in the select and comobobox component class.
 *
 * @public
 * */
export const listboxMaxHeight = DesignToken.create<number>(
    "listbox-max-height"
).withDefault(0);

/**
 * Base class for Select
 * @public
 */
export class Select extends FoundationSelect {
    public setPositioning(): void {
        super.setPositioning();

        listboxMaxHeight.setValueFor(this, this.maxHeight);
    }
}

/**
 * A function that returns a {@link @microsoft/fast-foundation#Select} registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#selectTemplate}
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
            class="select-indicator"
            part="select-indicator"
            viewBox="0 0 12 7"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M11.85.65c.2.2.2.5 0 .7L6.4 6.84a.55.55 0 01-.78 0L.14 1.35a.5.5 0 11.71-.7L6 5.8 11.15.65c.2-.2.5-.2.7 0z"
            />
        </svg>
    `,
});

/**
 * Styles for Select
 * @public
 */
export const selectStyles = styles;
