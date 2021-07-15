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
    /**
     * The current value
     */
    value: string;
    /**
     * The current dictionary ID
     */
    dictionaryId: string;
    /**
     * The current data location
     */
    dataLocation: string;
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
declare type Uncategorized = "<x>" | "<y>" | "<name-repeat>";
export declare type AllTypeKeys = Type | Syntax | Uncategorized;
export declare type AllTypes<TConfig> = {
    [key in AllTypeKeys]: TConfig;
};
export declare enum CSSControlType {
    "number" = 0,
    "text" = 1,
    "multiple" = 2,
    "function" = 3,
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
declare type NumberFieldType = Pick<
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
export declare const numberFieldTypes: NumberFieldType;
/**
 * Text values
 */
export interface TextFieldTypeConfig {
    type: CSSControlType.text;
}
declare type TextFieldType = Pick<
    AllTypes<TextFieldTypeConfig>,
    "<custom-ident>" | "<ident>" | "<string>"
>;
export declare const textFieldTypes: TextFieldType;
/**
 * Multiple values
 */
export interface MultipleTypeConfig {
    type: CSSControlType.multiple;
    separator: string;
    controls: TypeConfigs[];
}
declare type MultipleType = Pick<AllTypes<MultipleTypeConfig>, "<ratio>">;
export declare const multipleTypes: MultipleType;
/**
 * CSS functions
 */
export interface FunctionTypeConfig {
    type: CSSControlType.function;
    name: string;
    controls: TypeConfigs[];
}
declare type FunctionType = Pick<AllTypes<FunctionTypeConfig>, "<url>" | "<name-repeat>">;
export declare const functionTypes: FunctionType;
declare type AllType = NumberFieldType | TextFieldType | MultipleType | FunctionType;
export declare const allTypes: AllType;
declare type TypeConfigs =
    | NumberFieldTypeConfig
    | TextFieldTypeConfig
    | MultipleTypeConfig
    | FunctionTypeConfig;
export {};
