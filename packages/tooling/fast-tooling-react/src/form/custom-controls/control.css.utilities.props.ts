import {
    CSSPropertyRef,
    CSSSyntaxRef,
} from "@microsoft/fast-tooling/dist/data-utilities/mapping.mdn-data";
import { XOR } from "@microsoft/fast-tooling/dist/data-utilities/type.utilities";

export interface RenderControlConfig {
    /**
     * This maps to the React key so as to ensure
     * that values do not persist when switching
     * between different syntax references
     */
    key: string;

    /**
     * The change handler for form element onChange events
     * to use
     */
    handleChange: (value: string) => void;
}

export interface RenderRefControlConfig extends RenderControlConfig {
    ref: XOR<CSSPropertyRef, CSSSyntaxRef>;
}

interface SelectControlOptions {
    /**
     * This maps to the React key so as to ensure
     * that values do not persist when switching
     * between different syntax references
     */
    key: string;

    /**
     * The value of the option
     */
    value: number | string;

    /**
     * The display name for the option
     */
    displayName: string;
}

export interface RenderSelectControlConfig extends RenderControlConfig {
    options: SelectControlOptions[];
}
