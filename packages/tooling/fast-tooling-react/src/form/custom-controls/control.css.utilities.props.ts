import { CSSPropertyRef } from "@microsoft/fast-tooling/dist/data-utilities/mapping.mdn-data";

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
    ref: CSSPropertyRef;
}
