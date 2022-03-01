/**
 * Extracts the attribute type from an attribute name
 */
export const attributeTypeRegExp = /([:?@])?(.*)/;

/**
 * The types of attributes applied in a template
 */
export enum AttributeType {
    content,
    booleanContent,
    idl,
    event,
}
