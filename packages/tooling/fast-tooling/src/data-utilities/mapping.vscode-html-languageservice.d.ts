import { DataDictionary, SchemaDictionary } from "../message-system";
import { XOR } from "./type.utilities";
export interface MapNodeToDataDictionaryConfig {
    /**
     * The Monaco editor models value
     */
    value: string[];
    /**
     * The schema dictionary to extrapolate HTML elements
     * and text elements from
     */
    schemaDictionary: SchemaDictionary;
}
/**
 * Convert the parsed value to a data dictionary
 */
export declare function mapVSCodeParsedHTMLToDataDictionary(
    config: MapNodeToDataDictionaryConfig
): DataDictionary<unknown>;
export interface Attribute {
    name: string;
    value: any;
}
export interface ParsedValue {
    children: ParsedValue[];
    tag: string;
    attributes: {
        [key: string]: string;
    };
    start: number;
    end: number;
    startTagEnd: number;
    endTagStart?: number;
    content?: string;
    closed: boolean;
}
/**
 * Map data updates coming from the monaco editor and consolidate
 * them with the current data dictionary stored in the Message System
 */
export declare function mapVSCodeHTMLAndDataDictionaryToDataDictionary(
    value: string,
    textSchemaId: string,
    previousDataDictionary: DataDictionary<unknown>,
    schemaDictionary: SchemaDictionary
): XOR<DataDictionary<unknown>, null>;
