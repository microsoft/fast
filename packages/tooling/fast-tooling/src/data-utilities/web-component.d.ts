import { DataType } from "./types";
export declare type WebComponentAttributeValueType = string | number;
export interface WebComponentAttributeValues {
    /**
     * The value
     */
    name: WebComponentAttributeValueType;
}
export interface WebComponentAttribute {
    /**
     * The name of the attribute
     */
    name: string;
    /**
     * The type of value for this attribute
     */
    type: DataType;
    /**
     * The title of this attribute
     */
    title: string;
    /**
     * The description of this attribute
     */
    description: string;
    /**
     * The default value of this attribute
     */
    default: any;
    /**
     * A list of values
     */
    values?: WebComponentAttributeValues[];
    /**
     * Whether this was attribute is required
     */
    required: boolean;
}
export interface WebComponentSlot {
    /**
     * The name of the slot, if this is the default slot
     * this should be an emptry string
     */
    name: string;
    /**
     * The title of this slot
     */
    title: string;
    /**
     * The description of use of this slot
     */
    description: string;
}
export interface WebComponentDefinitionTag {
    /**
     * The name of the tag
     */
    name: string;
    /**
     * The title of this tag
     */
    title: string;
    /**
     * The description of this web component tag
     */
    description: string;
    /**
     * The attributes available for this tag
     */
    attributes: WebComponentAttribute[];
    /**
     * The slots available for this tag
     */
    slots: WebComponentSlot[];
}
/**
 * This is the data structure for a web component definition
 *
 * Important: if it is updated, also update the "../schemas/web-component.schema.ts" file
 */
export interface WebComponentDefinition {
    /**
     * The current version of this web component
     */
    version: 1;
    /**
     * The tags available for this web component
     */
    tags?: WebComponentDefinitionTag[];
}
