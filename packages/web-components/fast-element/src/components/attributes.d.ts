import { Accessor } from "../observation/observable";
/**
 * Represents objects that can convert values to and from
 * view or model representations.
 * @public
 */
export interface ValueConverter {
    /**
     * Converts a value from its representation in the model, to a representation for the view.
     * @param value - The value to convert to a view representation.
     */
    toView(value: any): any;
    /**
     * Converts a value from its representation in the view, to a representation for the model.
     * @param value - The value to convert to a model representation.
     */
    fromView(value: any): any;
}
/**
 * The mode that specifies the runtime behavior of the attribute.
 * @remarks
 * By default, attributes run in `reflect` mode, propagating their property
 * values to the DOM and DOM values to the property. The `boolean` mode also
 * reflects values, but uses the HTML standard boolean attribute behavior,
 * interpreting the presence of the attribute as `true` and the absence as
 * `false`. The `fromView` behavior only updates the  property value based on
 * changes in the DOM, but does not reflect property changes back.
 * @public
 */
export declare type AttributeMode = "reflect" | "boolean" | "fromView";
/**
 * Metadata used to configure a custom attribute's behavior.
 * @public
 */
export declare type AttributeConfiguration = {
    property: string;
    attribute?: string;
    mode?: AttributeMode;
    converter?: ValueConverter;
};
/**
 * Metadata used to configure a custom attribute's behavior through a decorator.
 * @public
 */
export declare type DecoratorAttributeConfiguration = Omit<
    AttributeConfiguration,
    "property"
>;
/**
 * A {@link ValueConverter} that converts to and from `boolean` values.
 * @remarks
 * Used automatically when the `boolean` {@link AttributeMode} is selected.
 * @public
 */
export declare const booleanConverter: ValueConverter;
/**
 * A {@link ValueConverter} that converts to and from `number` values.
 * @remarks
 * This converter allows for nullable numbers, returning `null` if the
 * input was `null`, `undefined`, or `NaN`.
 * @public
 */
export declare const nullableNumberConverter: ValueConverter;
/**
 * An implementation of {@link Accessor} that supports reactivity,
 * change callbacks, attribute reflection, and type conversion for
 * custom elements.
 * @public
 */
export declare class AttributeDefinition implements Accessor {
    private readonly fieldName;
    private readonly callbackName;
    private readonly hasCallback;
    private readonly guards;
    /**
     * The class constructor that owns this attribute.
     */
    readonly Owner: Function;
    /**
     * The name of the property associated with the attribute.
     */
    readonly name: string;
    /**
     * The name of the attribute in HTML.
     */
    readonly attribute: string;
    /**
     * The {@link AttributeMode} that describes the behavior of this attribute.
     */
    readonly mode: AttributeMode;
    /**
     * A {@link ValueConverter} that integrates with the property getter/setter
     * to convert values to and from a DOM string.
     */
    readonly converter?: ValueConverter;
    /**
     * Creates an instance of AttributeDefinition.
     * @param Owner - The class constructor that owns this attribute.
     * @param name - The name of the property associated with the attribute.
     * @param attribute - The name of the attribute in HTML.
     * @param mode - The {@link AttributeMode} that describes the behavior of this attribute.
     * @param converter - A {@link ValueConverter} that integrates with the property getter/setter
     * to convert values to and from a DOM string.
     */
    constructor(
        Owner: Function,
        name: string,
        attribute?: string,
        mode?: AttributeMode,
        converter?: ValueConverter
    );
    /**
     * Sets the value of the attribute/property on the source element.
     * @param source - The source element to access.
     * @param value - The value to set the attribute/property to.
     */
    setValue(source: HTMLElement, newValue: any): void;
    /**
     * Gets the value of the attribute/property on the source element.
     * @param source - The source element to access.
     */
    getValue(source: HTMLElement): any;
    /** @internal */
    onAttributeChangedCallback(element: HTMLElement, value: any): void;
    private tryReflectToAttribute;
    /**
     * Collects all attribute definitions associated with the owner.
     * @param Owner - The class constructor to collect attribute for.
     * @param attributeLists - Any existing attributes to collect and merge with those associated with the owner.
     * @internal
     */
    static collect(
        Owner: Function,
        ...attributeLists: (ReadonlyArray<string | AttributeConfiguration> | undefined)[]
    ): ReadonlyArray<AttributeDefinition>;
}
/**
 * Decorator: Specifies an HTML attribute.
 * @param config - The configuration for the attribute.
 * @public
 */
export declare function attr(
    config?: DecoratorAttributeConfiguration
): (target: {}, property: string) => void;
/**
 * Decorator:  Specifies an HTML attribute.
 * @param target - The class to define the attribute on.
 * @param prop - The property name to be associated with the attribute.
 * @public
 */
export declare function attr(target: {}, prop: string): void;
