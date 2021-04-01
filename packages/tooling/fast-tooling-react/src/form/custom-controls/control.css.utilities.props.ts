import {
    CSSPropertyRef,
    CSSSyntaxRef,
} from "@microsoft/fast-tooling/dist/esm/data-utilities/mapping.mdn-data";
import { XOR } from "@microsoft/fast-tooling/dist/esm/data-utilities/type.utilities";
import { Type } from "@microsoft/fast-tooling/dist/esm/css-data.types";
import { Syntax } from "@microsoft/fast-tooling/dist/esm/css-data.syntax";

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

type Uncategorized = "<x>" | "<y>" | "<name-repeat>";
export type AllTypeKeys = Type | Syntax | Uncategorized;

export type AllTypes<TConfig> = {
    [key in AllTypeKeys]: TConfig;
};

export enum CSSControlType {
    "number",
    "text",
    "multiple",
    "function",
}

/**
 * Number values
 *
 * These are often appended with text such as "px" or "deg"
 */
interface AppendType {
    unit: string[];
}

export interface NumberFieldTypeConfig {
    type: CSSControlType.number;
    append?: AppendType;
}

type NumberFieldType = Pick<
    AllTypes<NumberFieldTypeConfig>,
    | "<angle>"
    | "<dimension>"
    | "<flex>"
    | "<integer>"
    | "<length>"
    | "<number>"
    | "<percentage>"
    | "<resolution>"
    | "<time>"
    | "<x>"
    | "<y>"
>;

export const numberFieldTypes: NumberFieldType = {
    "<angle>": {
        type: CSSControlType.number,
        append: {
            unit: ["deg", "grad", "rad", "turn"],
        },
    },
    "<dimension>": {
        type: CSSControlType.number,
        append: {
            unit: ["px", "rem", "pt", "ms", "s", "hz", "Hz"],
        },
    },
    "<flex>": {
        type: CSSControlType.number,
        append: {
            unit: ["fr"],
        },
    },
    "<integer>": {
        type: CSSControlType.number,
    },
    "<length>": {
        type: CSSControlType.number,
        append: {
            unit: ["ch", "em", "ex", "rem", "vh", "vw", "vmin", "vmax"],
        },
    },
    "<number>": {
        type: CSSControlType.number,
    },
    "<percentage>": {
        type: CSSControlType.number,
        append: {
            unit: ["%"],
        },
    },
    "<resolution>": {
        type: CSSControlType.number,
        append: {
            unit: ["dpi", "dpcm", "dppx", "x"],
        },
    },
    "<time>": {
        type: CSSControlType.number,
        append: {
            unit: ["ms", "s"],
        },
    },
    "<x>": {
        type: CSSControlType.number,
    },
    "<y>": {
        type: CSSControlType.number,
    },
};

/**
 * Text values
 */
export interface TextFieldTypeConfig {
    type: CSSControlType.text;
}

type TextFieldType = Pick<
    AllTypes<TextFieldTypeConfig>,
    "<custom-ident>" | "<ident>" | "<string>"
>;

export const textFieldTypes: TextFieldType = {
    "<custom-ident>": {
        type: CSSControlType.text,
    },
    "<ident>": {
        type: CSSControlType.text,
    },
    "<string>": {
        type: CSSControlType.text,
    },
};

/**
 * Multiple values
 */
export interface MultipleTypeConfig {
    type: CSSControlType.multiple;
    separator: string;
    controls: TypeConfigs[];
}

type MultipleType = Pick<AllTypes<MultipleTypeConfig>, "<ratio>">;

export const multipleTypes: MultipleType = {
    "<ratio>": {
        type: CSSControlType.multiple,
        separator: "/",
        controls: [
            {
                type: CSSControlType.number,
            },
            {
                type: CSSControlType.number,
            },
        ],
    },
};

/**
 * CSS functions
 */
export interface FunctionTypeConfig {
    type: CSSControlType.function;
    name: string;
    controls: TypeConfigs[];
}

type FunctionType = Pick<AllTypes<FunctionTypeConfig>, "<url>" | "<name-repeat>">;

export const functionTypes: FunctionType = {
    "<url>": {
        type: CSSControlType.function,
        name: "url",
        controls: [
            {
                type: CSSControlType.text,
            },
        ],
    },
    "<name-repeat>": {
        type: CSSControlType.function,
        name: "repeat",
        controls: [
            {
                type: CSSControlType.text,
            },
        ],
    },
};

type AllType = NumberFieldType | TextFieldType | MultipleType | FunctionType;

export const allTypes: AllType = {
    ...numberFieldTypes,
    ...textFieldTypes,
    ...multipleTypes,
    ...functionTypes,
};

type TypeConfigs =
    | NumberFieldTypeConfig
    | TextFieldTypeConfig
    | MultipleTypeConfig
    | FunctionTypeConfig;
