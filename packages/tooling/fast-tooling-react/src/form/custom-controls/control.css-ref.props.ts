import {
    CSSPropertySyntax,
    CSSPropertyRef,
} from "@microsoft/fast-tooling/dist/data-utilities/mapping.mdn-data";

export interface CSSRefProps {
    /**
     * If this prop is available then this is the root level
     * CSS property reference, if not it is a partial reference
     * for a CSS property
     */
    mapsToProperty?: string;

    /**
     * The onChange callback to call when a value has been changed by
     * a form element
     */
    onChange: (value: string) => void;

    /**
     * The syntax or reference used to determine the form element UI
     */
    syntax: CSSPropertySyntax | CSSPropertyRef;
}

export interface CSSRefState {
    /**
     * The index of the select dropdown determining which form UI to show,
     * this will be used when multiple form element UI options are available
     * according to the syntax.
     */
    index: number;

    /**
     * The values available, since CSS can comprise of multiple values for example:
     *
     * border: 1px solid #000000;
     *
     * Each value will be represented in the array, for example:
     *
     * ["1px", "solid", "#000"]
     *
     * A single string cannot be used as indexes will move around depending on if certain values are omitted.
     * Example:
     * "1px solid #000" equates to ["1px", "solid", "#000"]
     * "1px #000" equates to ["1px", undefined, "#000"]
     *
     * Which preserves the order the string values must appear.
     */
    values: string[];
}
