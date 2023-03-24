import { Accessor, Observable } from "../observation/observable.js";
import type { Notifier } from "../observation/notifier.js";
import { isString } from "../interfaces.js";
import { Updates } from "../observation/update-queue.js";
import { DOM } from "../dom.js";
import { createMetadataLocator } from "../platform.js";

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

const booleanMode = "boolean";
const reflectMode = "reflect";

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
export type AttributeMode = typeof reflectMode | typeof booleanMode | "fromView";

/**
 * Metadata used to configure a custom attribute's behavior.
 * @public
 */
export type AttributeConfiguration = {
    property: string;
    attribute?: string;
    mode?: AttributeMode;
    converter?: ValueConverter;
};

/**
 * Metadata used to configure a custom attribute's behavior.
 * @public
 */
export const AttributeConfiguration = Object.freeze({
    /**
     * Locates all attribute configurations associated with a type.
     */
    locate: createMetadataLocator<AttributeConfiguration>(),
});

/**
 * Metadata used to configure a custom attribute's behavior through a decorator.
 * @public
 */
export type DecoratorAttributeConfiguration = Omit<AttributeConfiguration, "property">;

/**
 * A {@link ValueConverter} that converts to and from `boolean` values.
 * @remarks
 * Used automatically when the `boolean` {@link AttributeMode} is selected.
 * @public
 */
export const booleanConverter: ValueConverter = {
    toView(value: any): string {
        return value ? "true" : "false";
    },

    fromView(value: any): any {
        return value === null ||
            value === void 0 ||
            value === "false" ||
            value === false ||
            value === 0
            ? false
            : true;
    },
};

/**
 * A {@link ValueConverter} that converts to and from `boolean` values. `null`, `undefined`, `""`, and `void` values are converted to `null`.
 * @public
 */
export const nullableBooleanConverter: ValueConverter = {
    toView(value: any): string {
        return typeof value === "boolean" ? value.toString() : "";
    },

    fromView(value: any): any {
        return [null, undefined, void 0].includes(value)
            ? null
            : booleanConverter.fromView(value);
    },
};

function toNumber(value: any): any {
    if (value === null || value === undefined) {
        return null;
    }
    const number: number = value * 1;
    return isNaN(number) ? null : number;
}

/**
 * A {@link ValueConverter} that converts to and from `number` values.
 * @remarks
 * This converter allows for nullable numbers, returning `null` if the
 * input was `null`, `undefined`, or `NaN`.
 * @public
 */
export const nullableNumberConverter: ValueConverter = {
    toView(value: any): string | null {
        const output = toNumber(value);
        return output ? output.toString() : output;
    },

    fromView: toNumber,
};

/**
 * An implementation of {@link Accessor} that supports reactivity,
 * change callbacks, attribute reflection, and type conversion for
 * custom elements.
 * @public
 */
export class AttributeDefinition implements Accessor {
    private readonly fieldName: string;
    private readonly callbackName: string;
    private readonly hasCallback: boolean;
    private readonly guards: Set<unknown> = new Set();

    /**
     * The class constructor that owns this attribute.
     */
    public readonly Owner: Function;

    /**
     * The name of the property associated with the attribute.
     */
    public readonly name: string;

    /**
     * The name of the attribute in HTML.
     */
    public readonly attribute: string;

    /**
     * The {@link AttributeMode} that describes the behavior of this attribute.
     */
    public readonly mode: AttributeMode;

    /**
     * A {@link ValueConverter} that integrates with the property getter/setter
     * to convert values to and from a DOM string.
     */
    public readonly converter?: ValueConverter;

    /**
     * Creates an instance of AttributeDefinition.
     * @param Owner - The class constructor that owns this attribute.
     * @param name - The name of the property associated with the attribute.
     * @param attribute - The name of the attribute in HTML.
     * @param mode - The {@link AttributeMode} that describes the behavior of this attribute.
     * @param converter - A {@link ValueConverter} that integrates with the property getter/setter
     * to convert values to and from a DOM string.
     */
    public constructor(
        Owner: Function,
        name: string,
        attribute: string = name.toLowerCase(),
        mode: AttributeMode = reflectMode,
        converter?: ValueConverter
    ) {
        this.Owner = Owner;
        this.name = name;
        this.attribute = attribute;
        this.mode = mode;
        this.converter = converter;
        this.fieldName = `_${name}`;
        this.callbackName = `${name}Changed`;
        this.hasCallback = this.callbackName in Owner.prototype;

        if (mode === booleanMode && converter === void 0) {
            this.converter = booleanConverter;
        }
    }

    /**
     * Sets the value of the attribute/property on the source element.
     * @param source - The source element to access.
     * @param value - The value to set the attribute/property to.
     */
    public setValue(source: HTMLElement, newValue: any): void {
        const oldValue = source[this.fieldName];
        const converter = this.converter;

        if (converter !== void 0) {
            newValue = converter.fromView(newValue);
        }

        if (oldValue !== newValue) {
            source[this.fieldName] = newValue;

            this.tryReflectToAttribute(source);

            if (this.hasCallback) {
                source[this.callbackName](oldValue, newValue);
            }

            ((source as any).$fastController as Notifier).notify(this.name);
        }
    }

    /**
     * Gets the value of the attribute/property on the source element.
     * @param source - The source element to access.
     */
    public getValue(source: HTMLElement): any {
        Observable.track(source, this.name);
        return source[this.fieldName];
    }

    /** @internal */
    public onAttributeChangedCallback(element: HTMLElement, value: any): void {
        if (this.guards.has(element)) {
            return;
        }

        this.guards.add(element);
        this.setValue(element, value);
        this.guards.delete(element);
    }

    private tryReflectToAttribute(element: HTMLElement): void {
        const mode = this.mode;
        const guards = this.guards;

        if (guards.has(element) || mode === "fromView") {
            return;
        }

        Updates.enqueue(() => {
            guards.add(element);

            const latestValue = element[this.fieldName];

            switch (mode) {
                case reflectMode:
                    const converter = this.converter;
                    DOM.setAttribute(
                        element,
                        this.attribute,
                        converter !== void 0 ? converter.toView(latestValue) : latestValue
                    );
                    break;
                case booleanMode:
                    DOM.setBooleanAttribute(element, this.attribute, latestValue);
                    break;
            }

            guards.delete(element);
        });
    }

    /**
     * Collects all attribute definitions associated with the owner.
     * @param Owner - The class constructor to collect attribute for.
     * @param attributeLists - Any existing attributes to collect and merge with those associated with the owner.
     * @internal
     */
    public static collect(
        Owner: Function,
        ...attributeLists: (ReadonlyArray<string | AttributeConfiguration> | undefined)[]
    ): ReadonlyArray<AttributeDefinition> {
        const attributes: AttributeDefinition[] = [];

        attributeLists.push(AttributeConfiguration.locate(Owner));

        for (let i = 0, ii = attributeLists.length; i < ii; ++i) {
            const list = attributeLists[i];

            if (list === void 0) {
                continue;
            }

            for (let j = 0, jj = list.length; j < jj; ++j) {
                const config = list[j];

                if (isString(config)) {
                    attributes.push(new AttributeDefinition(Owner, config));
                } else {
                    attributes.push(
                        new AttributeDefinition(
                            Owner,
                            config.property,
                            config.attribute,
                            config.mode,
                            config.converter
                        )
                    );
                }
            }
        }

        return attributes;
    }
}

/**
 * Decorator: Specifies an HTML attribute.
 * @param config - The configuration for the attribute.
 * @public
 */
export function attr(
    config?: DecoratorAttributeConfiguration
): (target: {}, property: string) => void;

/**
 * Decorator:  Specifies an HTML attribute.
 * @param target - The class to define the attribute on.
 * @param prop - The property name to be associated with the attribute.
 * @public
 */
export function attr(target: {}, prop: string): void;
export function attr(
    configOrTarget?: DecoratorAttributeConfiguration | {},
    prop?: string
): void | ((target: {}, property: string) => void) {
    let config: AttributeConfiguration;

    function decorator($target: {}, $prop: string): void {
        if (arguments.length > 1) {
            // Non invocation:
            // - @attr
            // Invocation with or w/o opts:
            // - @attr()
            // - @attr({...opts})
            config.property = $prop;
        }

        AttributeConfiguration.locate($target.constructor).push(config);
    }

    if (arguments.length > 1) {
        // Non invocation:
        // - @attr
        config = {} as any;
        decorator(configOrTarget!, prop!);
        return;
    }

    // Invocation with or w/o opts:
    // - @attr()
    // - @attr({...opts})
    config = configOrTarget === void 0 ? ({} as any) : configOrTarget;
    return decorator;
}
